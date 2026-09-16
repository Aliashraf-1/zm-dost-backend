const RealEstateProperty = require('../models/RealEstateProperty');
const RealEstateRevenue = require('../models/RealEstateRevenue');

// ============================================================
// GET ALL PROPERTIES
// ============================================================
exports.getProperties = async (req, res) => {
  try {
    const { listingType, status, search } = req.query;

    let query = {};
    if (listingType) query.listingType = listingType;
    if (status) query.status = status;

    let properties = await RealEstateProperty.find(query).sort({ createdAt: -1 });

    // Search filter (client-side for simplicity)
    if (search) {
      const regex = new RegExp(search, 'i');
      properties = properties.filter(p =>
        regex.test(p.ownerName) ||
        regex.test(p.ownerPhone) ||
        regex.test(p.society) ||
        regex.test(p.city) ||
        regex.test(p.region)
      );
    }

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// GET SINGLE PROPERTY
// ============================================================
exports.getProperty = async (req, res) => {
  try {
    const property = await RealEstateProperty.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }
    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// CREATE PROPERTY
// ============================================================
exports.createProperty = async (req, res) => {
  try {
    let propertyData = typeof req.body.propertyData === 'string'
      ? JSON.parse(req.body.propertyData)
      : req.body;

    // Handle uploaded photos
    if (req.files && req.files.length > 0) {
      const photoPaths = req.files.map(file => `/uploads/re-properties/${file.filename}`);
      propertyData.photos = [...(propertyData.photos || []), ...photoPaths];
    }

    const property = await RealEstateProperty.create(propertyData);

    res.status(201).json({
      success: true,
      message: 'Property created successfully.',
      data: property,
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// UPDATE PROPERTY
// ============================================================
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = typeof req.body.propertyData === 'string'
      ? JSON.parse(req.body.propertyData)
      : req.body;

    // Handle new photos
    if (req.files && req.files.length > 0) {
      const photoPaths = req.files.map(file => `/uploads/re-properties/${file.filename}`);
      updates.photos = [...(updates.photos || []), ...photoPaths];
    }

    const property = await RealEstateProperty.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property updated successfully.',
      data: property,
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// CLOSE PROPERTY (Status Update)
// ============================================================
exports.closeProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      closedReason,
      commission,          // ✅ only for closed_via_us
      commissionType,      // 'sale_commission' or 'rent_commission'
      closedByName,
    } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required.',
      });
    }

    const property = await RealEstateProperty.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Update property
    property.status = status;
    property.closedAt = new Date().toISOString();
    property.closedReason = closedReason || '';
    property.commission = Number(commission) || 0;

    await property.save();

    // ✅ If closed via us with commission, add to revenue
    if (status === 'closed_via_us' && Number(commission) > 0) {
      let revenue = await RealEstateRevenue.findOne();
      if (!revenue) {
        revenue = await RealEstateRevenue.create({
          transactions: [],
          totalRevenue: 0,
          saleCommissionTotal: 0,
          rentCommissionTotal: 0,
        });
      }

      const transactionType = commissionType ||
        (property.listingType === 'for_sale' ? 'sale_commission' : 'rent_commission');

      const propertyTitle = `${property.society} - ${property.propertyType} (${property.area} ${property.areaUnit})`;

      revenue.transactions.push({
        id: `re-tx-${Date.now()}`,
        type: transactionType,
        propertyId: property._id,
        propertyTitle,
        propertyType: property.propertyType,
        amount: Number(commission),
        date: new Date().toISOString(),
        remarks: closedReason || 'Commission from property closure',
        createdBy: property.updatedBy || null,
        createdByName: closedByName || property.updatedByName || '',
      });

      // Recalculate totals
      revenue.totalRevenue = revenue.transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      revenue.saleCommissionTotal = revenue.transactions
        .filter(t => t.type === 'sale_commission')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      revenue.rentCommissionTotal = revenue.transactions
        .filter(t => t.type === 'rent_commission')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      await revenue.save();
    }

    res.status(200).json({
      success: true,
      message: 'Property closed successfully.',
      data: property,
    });
  } catch (error) {
    console.error('Close property error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// DELETE PROPERTY
// ============================================================
exports.deleteProperty = async (req, res) => {
  try {
    const property = await RealEstateProperty.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Property deleted successfully.',
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
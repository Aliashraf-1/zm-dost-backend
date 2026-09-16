const RealEstateRequirement = require('../models/RealEstateRequirement');

// ============================================================
// GET ALL REQUIREMENTS
// ============================================================
exports.getRequirements = async (req, res) => {
  try {
    const { requirementType, status, search } = req.query;

    let query = {};
    if (requirementType) query.requirementType = requirementType;
    if (status) query.status = status;

    let requirements = await RealEstateRequirement.find(query).sort({ createdAt: -1 });

    if (search) {
      const regex = new RegExp(search, 'i');
      requirements = requirements.filter(r =>
        regex.test(r.name) ||
        regex.test(r.phone) ||
        regex.test(r.preferredArea) ||
        regex.test(r.city) ||
        regex.test(r.region)
      );
    }

    res.status(200).json({
      success: true,
      count: requirements.length,
      data: requirements,
    });
  } catch (error) {
    console.error('Get requirements error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// GET SINGLE REQUIREMENT
// ============================================================
exports.getRequirement = async (req, res) => {
  try {
    const requirement = await RealEstateRequirement.findById(req.params.id);
    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Requirement not found.',
      });
    }
    res.status(200).json({
      success: true,
      data: requirement,
    });
  } catch (error) {
    console.error('Get requirement error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// CREATE REQUIREMENT
// ============================================================
exports.createRequirement = async (req, res) => {
  try {
    const requirement = await RealEstateRequirement.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Requirement created successfully.',
      data: requirement,
    });
  } catch (error) {
    console.error('Create requirement error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// UPDATE REQUIREMENT
// ============================================================
exports.updateRequirement = async (req, res) => {
  try {
    const requirement = await RealEstateRequirement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Requirement not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Requirement updated successfully.',
      data: requirement,
    });
  } catch (error) {
    console.error('Update requirement error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// DELETE REQUIREMENT
// ============================================================
exports.deleteRequirement = async (req, res) => {
  try {
    const requirement = await RealEstateRequirement.findByIdAndDelete(req.params.id);
    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Requirement not found.',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Requirement deleted successfully.',
    });
  } catch (error) {
    console.error('Delete requirement error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const Lead = require('../models/Lead');
const Employee = require('../models/Employee');
const mongoose = require('mongoose');

const ADMIN_ROLES = ['super_admin', 'admin'];
const MANAGER_ROLES = ['lead_manager', 'moderator'];

// ✅ Fields jo cleanEmpty se preserve karni hain
const PRESERVE_FIELDS = ['lastStatusUpdate', 'lastUpdatedAt'];

const toObjectId = (value) => {
  if (!value) return null;
  if (value instanceof mongoose.Types.ObjectId) return value;
  if (typeof value === 'object') {
    const id = value._id || value.id;
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    }
    return null;
  }
  if (mongoose.Types.ObjectId.isValid(value)) {
    return new mongoose.Types.ObjectId(value);
  }
  return null;
};

const cleanEmpty = (data) => {
  Object.keys(data).forEach((key) => {
    // ✅ Preserve timestamp fields even if null/undefined
    if (PRESERVE_FIELDS.includes(key)) return;
    if (data[key] === '' || data[key] === null || data[key] === undefined) {
      delete data[key];
    }
  });
  return data;
};

const getActor = async (req) => {
  const user = req.user;
  const employee = await Employee.findOne({ email: user.email });
  const isAdmin = ADMIN_ROLES.includes(user.role);
  const canManage =
    isAdmin ||
    MANAGER_ROLES.includes(user.role) ||
    (user.role === 'employee' && employee?.canManageLeads === true);

  return { user, employee, isAdmin, canManage };
};

const isOwnLead = (lead, actor) => {
  const userId = String(actor.user._id);
  const empId = actor.employee ? String(actor.employee._id) : null;
  const createdBy = lead.createdBy?._id || lead.createdBy;
  const assignedTo = lead.assignedTo?._id || lead.assignedTo;
  return String(createdBy) === userId || (empId && String(assignedTo) === empId);
};

const populateLead = (query) =>
  query
    .populate('assignedTo', 'name email phone designation')
    .populate('createdBy', 'name email');

exports.getLeads = async (req, res) => {
  try {
    const actor = await getActor(req);
    const query = actor.isAdmin
      ? {}
      : {
          $or: [
            { createdBy: actor.user._id },
            ...(actor.employee ? [{ assignedTo: actor.employee._id }] : []),
          ],
        };
    const leads = await populateLead(Lead.find(query)).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getLead = async (req, res) => {
  try {
    const actor = await getActor(req);
    const { id } = req.params;
    const lead = await populateLead(Lead.findById(id));

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.',
      });
    }

    if (!actor.isAdmin && !isOwnLead(lead, actor)) {
      return res.status(403).json({ success: false, message: 'You can only view your own leads.' });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getLeadsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const actor = await getActor(req);

    if (!actor.isAdmin && (!actor.employee || String(actor.employee._id) !== String(employeeId))) {
      return res.status(403).json({ success: false, message: 'You can only view your own leads.' });
    }

    let query;
    if (mongoose.Types.ObjectId.isValid(employeeId)) {
      query = { assignedTo: new mongoose.Types.ObjectId(employeeId) };
    } else if (!isNaN(employeeId)) {
      query = { assignedTo: Number(employeeId) };
    } else {
      query = { assignedTo: employeeId };
    }

    const leads = await populateLead(Lead.find(query)).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error('Get leads by employee error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createLead = async (req, res) => {
  try {
    const actor = await getActor(req);
    if (!actor.canManage) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to add leads.',
      });
    }

    const leadData = cleanEmpty({ ...req.body });

    leadData.createdBy = actor.user._id;
    leadData.createdByName = actor.user.name;

    // ✅ New lead: set both timestamps
    const now = new Date().toISOString();
    leadData.lastStatusUpdate = now;
    leadData.lastUpdatedAt = now;

    if (!actor.isAdmin) {
      if (actor.employee) {
        leadData.assignedTo = actor.employee._id;
        leadData.assignedToName = actor.employee.name;
      } else {
        leadData.assignedTo = null;
        leadData.assignedToName = actor.user.name;
      }
    } else if (leadData.assignedTo) {
      const assignedId = toObjectId(leadData.assignedTo);
      leadData.assignedTo = assignedId || leadData.assignedTo;
    }

    const lead = await Lead.create(leadData);
    const populatedLead = await populateLead(Lead.findById(lead._id));

    res.status(201).json({
      success: true,
      message: 'Lead created successfully.',
      data: populatedLead,
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const actor = await getActor(req);
    if (!actor.canManage) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update leads.',
      });
    }

    const { id } = req.params;
    const existing = await Lead.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.',
      });
    }

    if (!actor.isAdmin && !isOwnLead(existing, actor)) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own leads.',
      });
    }

    const updates = cleanEmpty({ ...req.body });
    delete updates.createdBy;
    delete updates.createdByName;
    delete updates._id;
    delete updates.id;

    if (!actor.isAdmin) {
      delete updates.assignedTo;
      delete updates.assignedToName;
    } else if (updates.assignedTo) {
      const assignedId = toObjectId(updates.assignedTo);
      if (assignedId) updates.assignedTo = assignedId;
    }

    // ✅ Always update lastUpdatedAt
    const now = new Date().toISOString();
    updates.lastUpdatedAt = now;

    // ✅ If status changed, update lastStatusUpdate
    if (updates.status && updates.status !== existing.status) {
      updates.lastStatusUpdate = now;
    }

    if (updates.status === 'Converted' && existing.status !== 'Converted') {
      updates.convertedAt = new Date().toISOString();
    }

    const lead = await populateLead(
      Lead.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
    );

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully.',
      data: lead,
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addNote = async (req, res) => {
  try {
    const actor = await getActor(req);
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.',
      });
    }

    if (!actor.canManage || (!actor.isAdmin && !isOwnLead(lead, actor))) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to add notes to this lead.',
      });
    }

    const noteData = { ...req.body };
    noteData.createdBy = actor.user._id;
    noteData.createdByName = noteData.createdByName || actor.user.name;
    if (!noteData.createdAt) {
      noteData.createdAt = new Date().toISOString();
    }

    lead.notes.push(noteData);
    await lead.save();

    const populatedLead = await populateLead(Lead.findById(lead._id));

    res.status(200).json({
      success: true,
      message: 'Note added successfully.',
      data: populatedLead,
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    if (!ADMIN_ROLES.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete leads.',
      });
    }

    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully.',
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
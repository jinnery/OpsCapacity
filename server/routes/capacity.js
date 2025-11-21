const express = require('express');
const router = express.Router();
const capacityController = require('../controllers/capacityController');

// CTO Dashboard API
router.get('/cto-dashboard', capacityController.getCTODashboard);

// CEO Dashboard API  
router.get('/ceo-dashboard', capacityController.getCEODashboard);

// Operations Director Dashboard API
router.get('/ops-director-dashboard', capacityController.getOpsDirectorDashboard);

// Operations Engineer Dashboard API
router.get('/ops-engineer-dashboard', capacityController.getOpsEngineerDashboard);

// Component Details API
router.get('/component/:componentId', capacityController.getComponentDetails);

module.exports = router;
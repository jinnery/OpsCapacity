const moment = require('moment');

// Mock data for demonstration - in real implementation, this would come from metrics_daily table
const mockMetricsData = [
  {
    id: 1,
    component_name: 'API Gateway',
    current_usage_p95: 85.2,
    current_usage_p99: 92.1,
    is_saturated: true,
    saturation_severity: 'critical',
    days_to_saturation: 3,
    predicted_saturation_date: moment().add(3, 'days').format('YYYY-MM-DD'),
    component_type: 'gateway'
  },
  {
    id: 2,
    component_name: 'DB Connection Pool',
    current_usage_p95: 75.8,
    current_usage_p99: 81.5,
    is_saturated: true,
    saturation_severity: 'warning',
    days_to_saturation: 8,
    predicted_saturation_date: moment().add(8, 'days').format('YYYY-MM-DD'),
    component_type: 'database'
  },
  {
    id: 3,
    component_name: 'Redis Cache',
    current_usage_p95: 45.3,
    current_usage_p99: 52.1,
    is_saturated: false,
    saturation_severity: 'normal',
    days_to_saturation: 25,
    predicted_saturation_date: moment().add(25, 'days').format('YYYY-MM-DD'),
    component_type: 'cache'
  },
  {
    id: 4,
    component_name: 'Load Balancer',
    current_usage_p95: 68.9,
    current_usage_p99: 74.2,
    is_saturated: false,
    saturation_severity: 'normal',
    days_to_saturation: 12,
    predicted_saturation_date: moment().add(12, 'days').format('YYYY-MM-DD'),
    component_type: 'loadbalancer'
  },
  {
    id: 5,
    component_name: 'Message Queue',
    current_usage_p95: 91.5,
    current_usage_p99: 96.8,
    is_saturated: true,
    saturation_severity: 'critical',
    days_to_saturation: 2,
    predicted_saturation_date: moment().add(2, 'days').format('YYYY-MM-DD'),
    component_type: 'queue'
  }
];

// Calculate priority based on days to saturation
const calculatePriority = (daysToSaturation) => {
  if (daysToSaturation < 7) return 'P1';
  if (daysToSaturation < 14) return 'P2';
  if (daysToSaturation < 30) return 'P3';
  return 'P4';
};

// Generate expansion plan based on component type
const generateExpansionPlan = (component) => {
  const plans = {
    'gateway': {
      solution: 'Add additional gateway nodes and implement horizontal scaling',
      workHours: 16,
      expectedImprovement: '50% capacity increase',
      steps: ['Deploy new gateway instances', 'Update load balancer configuration', 'Monitor traffic distribution']
    },
    'database': {
      solution: 'Increase connection pool size and optimize query performance',
      workHours: 12,
      expectedImprovement: '30% capacity increase',
      steps: ['Adjust connection pool parameters', 'Add read replicas', 'Optimize slow queries']
    },
    'cache': {
      solution: 'Scale up cache cluster and implement better eviction policies',
      workHours: 8,
      expectedImprovement: '40% capacity increase',
      steps: ['Add cache nodes', 'Update eviction policies', 'Warm up cache with hot data']
    },
    'loadbalancer': {
      solution: 'Upgrade load balancer configuration and add health checks',
      workHours: 6,
      expectedImprovement: '25% capacity increase',
      steps: ['Update LB configuration', 'Add health checks', 'Test failover scenarios']
    },
    'queue': {
      solution: 'Scale up queue workers and optimize message processing',
      workHours: 10,
      expectedImprovement: '60% capacity increase',
      steps: ['Add worker instances', 'Optimize message processing', 'Monitor queue depth']
    }
  };
  
  return plans[component.component_type] || plans['cache'];
};

// Assess business impact
const assessBusinessImpact = (component) => {
  if (component.saturation_severity === 'critical') {
    return {
      impact: 'High risk of service outage, potential revenue loss',
      userImpact: 'Service degradation or complete failure',
      riskLevel: 'Critical'
    };
  } else if (component.saturation_severity === 'warning') {
    return {
      impact: 'Performance degradation affecting user experience',
      userImpact: 'Slower response times, occasional timeouts',
      riskLevel: 'High'
    };
  } else {
    return {
      impact: 'Minor performance impact',
      userImpact: 'Slightly increased response times',
      riskLevel: 'Medium'
    };
  }
};

// CTO Dashboard Controller
const getCTODashboard = (req, res) => {
  const ctoData = mockMetricsData.map(component => {
    const priority = calculatePriority(component.days_to_saturation);
    const plan = generateExpansionPlan(component);
    
    return {
      id: component.id,
      componentName: component.component_name,
      currentUsageP95: component.current_usage_p95,
      currentUsageP99: component.current_usage_p99,
      predictedSaturationDate: component.predicted_saturation_date,
      priority,
      saturationSeverity: component.saturation_severity,
      expansionPlan: plan.solution,
      workHours: plan.workHours,
      expectedImprovement: plan.expectedImprovement
    };
  }).sort((a, b) => {
    const priorityOrder = { 'P1': 1, 'P2': 2, 'P3': 3, 'P4': 4 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  res.json(ctoData);
};

// CEO Dashboard Controller
const getCEODashboard = (req, res) => {
  const ceoData = mockMetricsData.map(component => {
    const priority = calculatePriority(component.days_to_saturation);
    const businessImpact = assessBusinessImpact(component);
    
    return {
      id: component.id,
      componentName: component.component_name,
      businessImpact: businessImpact.impact,
      userImpact: businessImpact.userImpact,
      riskLevel: businessImpact.riskLevel,
      deadline: component.predicted_saturation_date,
      priority,
      recommendation: priority === 'P1' ? '【必须立即扩容】' : 
                     priority === 'P2' ? '【建议近期扩容】' : '【暂无压力】'
    };
  }).sort((a, b) => {
    const riskOrder = { 'Critical': 1, 'High': 2, 'Medium': 3, 'Low': 4 };
    return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
  });

  res.json(ceoData);
};

// Operations Director Dashboard Controller
const getOpsDirectorDashboard = (req, res) => {
  const opsDirectorData = mockMetricsData.map(component => {
    const priority = calculatePriority(component.days_to_saturation);
    const plan = generateExpansionPlan(component);
    
    return {
      id: component.id,
      componentName: component.component_name,
      priority,
      daysToSaturation: component.days_to_saturation,
      saturationDate: component.predicted_saturation_date,
      workHours: plan.workHours,
      requiredResources: `${Math.ceil(plan.workHours / 8)} engineers`,
      completionWeek: `Week ${Math.ceil(component.days_to_saturation / 7)}`
    };
  }).sort((a, b) => a.daysToSaturation - b.daysToSaturation);

  // Group by weeks for planning
  const weeklyPlan = {};
  opsDirectorData.forEach(item => {
    if (!weeklyPlan[item.completionWeek]) {
      weeklyPlan[item.completionWeek] = [];
    }
    weeklyPlan[item.completionWeek].push(item);
  });

  res.json({
    sortedComponents: opsDirectorData,
    weeklyPlan,
    totalWorkHours: opsDirectorData.reduce((sum, item) => sum + item.workHours, 0),
    estimatedCompletion: Math.max(...opsDirectorData.map(item => item.daysToSaturation))
  });
};

// Operations Engineer Dashboard Controller
const getOpsEngineerDashboard = (req, res) => {
  const opsEngineerData = mockMetricsData.map(component => {
    const priority = calculatePriority(component.days_to_saturation);
    const plan = generateExpansionPlan(component);
    
    return {
      id: component.id,
      componentName: component.component_name,
      priority,
      currentStatus: {
        usageP95: component.current_usage_p95,
        usageP99: component.current_usage_p99,
        saturationSeverity: component.saturation_severity
      },
      expansionSteps: plan.steps,
      totalWorkHours: plan.workHours,
      expectedOutcome: plan.expectedImprovement,
      verificationMethods: [
        'Monitor usage metrics after expansion',
        'Run load tests to verify improvement',
        'Check system logs for errors',
        'Validate user experience metrics'
      ],
      potentialRisks: [
        'Service downtime during expansion',
        'Configuration errors',
        'Performance regression',
        'Insufficient testing'
      ]
    };
  }).sort((a, b) => {
    const priorityOrder = { 'P1': 1, 'P2': 2, 'P3': 3, 'P4': 4 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  res.json(opsEngineerData);
};

// Component Details Controller
const getComponentDetails = (req, res) => {
  const { componentId } = req.params;
  const component = mockMetricsData.find(c => c.id == componentId);
  
  if (!component) {
    return res.status(404).json({ error: 'Component not found' });
  }

  const priority = calculatePriority(component.days_to_saturation);
  const plan = generateExpansionPlan(component);
  const businessImpact = assessBusinessImpact(component);

  res.json({
    component: {
      id: component.id,
      name: component.component_name,
      type: component.component_type,
      currentUsageP95: component.current_usage_p95,
      currentUsageP99: component.current_usage_p99,
      isSaturated: component.is_saturated,
      saturationSeverity: component.saturation_severity,
      daysToSaturation: component.days_to_saturation,
      predictedSaturationDate: component.predicted_saturation_date,
      priority
    },
    cpuAnomalyDetails: {
      hasAnomaly: component.cpu_saturation_anomaly,
      anomalyType: component.anomaly_type,
      daysToSaturation: component.cpu_days_to_saturation,
      anomalyMark: 'cpu_saturation_anomaly',
      normalPeriod: component.normal_metrics,
      anomalyPeriod: component.anomaly_metrics,
      comparison: {
        avgCpuIncrease: ((component.anomaly_metrics.avg_cpu - component.normal_metrics.avg_cpu) / component.normal_metrics.avg_cpu * 100).toFixed(1),
        p95CpuIncrease: ((component.anomaly_metrics.p95_cpu - component.normal_metrics.p95_cpu) / component.normal_metrics.p95_cpu * 100).toFixed(1),
        latencyIncrease: ((component.anomaly_metrics.latency_ms - component.normal_metrics.latency_ms) / component.normal_metrics.latency_ms * 100).toFixed(1),
        errorRateIncrease: ((component.anomaly_metrics.error_rate - component.normal_metrics.error_rate) / component.normal_metrics.error_rate * 100).toFixed(1)
      },
      rawDataSamples: component.raw_data_samples
    },
    technicalDetails: {
      expansionPlan: plan.solution,
      workHours: plan.workHours,
      expectedImprovement: plan.expectedImprovement,
      steps: plan.steps
    },
    businessDetails: businessImpact,
    verification: [
      'Monitor usage metrics after expansion',
      'Run load tests to verify improvement',
      'Check system logs for errors',
      'Validate user experience metrics'
    ]
  });
};

module.exports = {
  getCTODashboard,
  getCEODashboard,
  getOpsDirectorDashboard,
  getOpsEngineerDashboard,
  getComponentDetails
};
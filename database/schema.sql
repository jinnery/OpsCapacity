-- 创建容量监控数据库表
-- 此文件用于演示如何创建真实的 metrics_daily 表

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS capacity_monitoring;
USE capacity_monitoring;

-- 创建组件表
CREATE TABLE IF NOT EXISTS components (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('gateway', 'database', 'cache', 'loadbalancer', 'queue', 'other') NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建每日指标表
CREATE TABLE IF NOT EXISTS metrics_daily (
  id INT AUTO_INCREMENT PRIMARY KEY,
  component_id INT NOT NULL,
  date DATE NOT NULL,
  current_usage_p95 DECIMAL(5,2) NOT NULL,
  current_usage_p99 DECIMAL(5,2) NOT NULL,
  is_saturated BOOLEAN NOT NULL DEFAULT FALSE,
  saturation_severity ENUM('normal', 'warning', 'critical') NOT NULL DEFAULT 'normal',
  days_to_saturation INT NOT NULL,
  predicted_saturation_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE,
  UNIQUE KEY unique_component_date (component_id, date),
  INDEX idx_days_to_saturation (days_to_saturation),
  INDEX idx_saturation_severity (saturation_severity),
  INDEX idx_predicted_saturation_date (predicted_saturation_date)
);

-- 插入示例组件数据
INSERT INTO components (name, type, description) VALUES
('API Gateway', 'gateway', '主要API网关，处理所有外部请求'),
('DB Connection Pool', 'database', '数据库连接池，管理数据库连接'),
('Redis Cache', 'cache', 'Redis缓存集群，提供高速缓存服务'),
('Load Balancer', 'loadbalancer', '负载均衡器，分发流量到后端服务'),
('Message Queue', 'queue', '消息队列，处理异步任务');

-- 插入示例指标数据
INSERT INTO metrics_daily (
  component_id, date, current_usage_p95, current_usage_p99, 
  is_saturated, saturation_severity, days_to_saturation, predicted_saturation_date
) VALUES
-- API Gateway - 临界状态
(1, CURDATE(), 85.2, 92.1, TRUE, 'critical', 3, DATE_ADD(CURDATE(), INTERVAL 3 DAY)),

-- DB Connection Pool - 警告状态  
(2, CURDATE(), 75.8, 81.5, TRUE, 'warning', 8, DATE_ADD(CURDATE(), INTERVAL 8 DAY)),

-- Redis Cache - 正常状态
(3, CURDATE(), 45.3, 52.1, FALSE, 'normal', 25, DATE_ADD(CURDATE(), INTERVAL 25 DAY)),

-- Load Balancer - 正常状态
(4, CURDATE(), 68.9, 74.2, FALSE, 'normal', 12, DATE_ADD(CURDATE(), INTERVAL 12 DAY)),

-- Message Queue - 临界状态
(5, CURDATE(), 91.5, 96.8, TRUE, 'critical', 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY));

-- 创建扩容方案表
CREATE TABLE IF NOT EXISTS expansion_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  component_type ENUM('gateway', 'database', 'cache', 'loadbalancer', 'queue', 'other') NOT NULL,
  solution TEXT NOT NULL,
  work_hours INT NOT NULL DEFAULT 8,
  expected_improvement VARCHAR(255) NOT NULL,
  steps JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_component_type (component_type)
);

-- 插入扩容方案数据
INSERT INTO expansion_plans (component_type, solution, work_hours, expected_improvement, steps) VALUES
('gateway', 'Add additional gateway nodes and implement horizontal scaling', 16, '50% capacity increase', 
 JSON_ARRAY('Deploy new gateway instances', 'Update load balancer configuration', 'Monitor traffic distribution')),

('database', 'Increase connection pool size and optimize query performance', 12, '30% capacity increase',
 JSON_ARRAY('Adjust connection pool parameters', 'Add read replicas', 'Optimize slow queries')),

('cache', 'Scale up cache cluster and implement better eviction policies', 8, '40% capacity increase',
 JSON_ARRAY('Add cache nodes', 'Update eviction policies', 'Warm up cache with hot data')),

('loadbalancer', 'Upgrade load balancer configuration and add health checks', 6, '25% capacity increase',
 JSON_ARRAY('Update LB configuration', 'Add health checks', 'Test failover scenarios')),

('queue', 'Scale up queue workers and optimize message processing', 10, '60% capacity increase',
 JSON_ARRAY('Add worker instances', 'Optimize message processing', 'Monitor queue depth'));

-- 创建视图：当前容量状态
CREATE OR REPLACE VIEW current_capacity_status AS
SELECT 
  c.id,
  c.name AS component_name,
  c.type AS component_type,
  m.current_usage_p95,
  m.current_usage_p99,
  m.is_saturated,
  m.saturation_severity,
  m.days_to_saturation,
  m.predicted_saturation_date,
  ep.solution AS expansion_plan,
  ep.work_hours,
  ep.expected_improvement,
  ep.steps,
  CASE 
    WHEN m.days_to_saturation < 7 THEN 'P1'
    WHEN m.days_to_saturation < 14 THEN 'P2'
    WHEN m.days_to_saturation < 30 THEN 'P3'
    ELSE 'P4'
  END AS priority
FROM components c
JOIN metrics_daily m ON c.id = m.component_id
JOIN expansion_plans ep ON c.type = ep.component_type
WHERE m.date = CURDATE();

-- 创建存储过程：计算优先级
DELIMITER //
CREATE PROCEDURE CalculateCapacityPriority(IN days_to_saturation INT, OUT priority VARCHAR(10))
BEGIN
  IF days_to_saturation < 7 THEN
    SET priority = 'P1';
  ELSEIF days_to_saturation < 14 THEN
    SET priority = 'P2';
  ELSEIF days_to_saturation < 30 THEN
    SET priority = 'P3';
  ELSE
    SET priority = 'P4';
  END IF;
END //
DELIMITER ;

-- 创建触发器：自动更新饱和状态
DELIMITER //
CREATE TRIGGER update_saturation_status
BEFORE INSERT ON metrics_daily
FOR EACH ROW
BEGIN
  SET NEW.is_saturated = (NEW.current_usage_p95 > 80 OR NEW.current_usage_p99 > 80);
  
  IF NEW.current_usage_p95 > 90 OR NEW.current_usage_p99 > 95 THEN
    SET NEW.saturation_severity = 'critical';
  ELSEIF NEW.current_usage_p95 > 70 OR NEW.current_usage_p99 > 80 THEN
    SET NEW.saturation_severity = 'warning';
  ELSE
    SET NEW.saturation_severity = 'normal';
  END IF;
END //
DELIMITER ;

-- 创建索引以优化查询性能
CREATE INDEX idx_metrics_date ON metrics_daily(date);
CREATE INDEX idx_components_type ON components(type);
CREATE INDEX idx_expansion_plans_type ON expansion_plans(component_type);

-- 示例查询：获取CTO视角数据
/*
SELECT 
  id,
  component_name,
  current_usage_p95,
  current_usage_p99,
  predicted_saturation_date,
  priority,
  saturation_severity,
  expansion_plan,
  work_hours,
  expected_improvement
FROM current_capacity_status
ORDER BY 
  CASE priority
    WHEN 'P1' THEN 1
    WHEN 'P2' THEN 2
    WHEN 'P3' THEN 3
    WHEN 'P4' THEN 4
  END;
*/

-- 示例查询：获取CEO视角数据
/*
SELECT 
  id,
  component_name,
  CASE saturation_severity
    WHEN 'critical' THEN 'High risk of service outage, potential revenue loss'
    WHEN 'warning' THEN 'Performance degradation affecting user experience'
    ELSE 'Minor performance impact'
  END AS business_impact,
  CASE saturation_severity
    WHEN 'critical' THEN 'Service degradation or complete failure'
    WHEN 'warning' THEN 'Slower response times, occasional timeouts'
    ELSE 'Slightly increased response times'
  END AS user_impact,
  CASE saturation_severity
    WHEN 'critical' THEN 'Critical'
    WHEN 'warning' THEN 'High'
    ELSE 'Medium'
  END AS risk_level,
  predicted_saturation_date AS deadline,
  priority,
  CASE 
    WHEN priority = 'P1' THEN '【必须立即扩容】'
    WHEN priority = 'P2' THEN '【建议近期扩容】'
    ELSE '【暂无压力】'
  END AS recommendation
FROM current_capacity_status
ORDER BY 
  CASE risk_level
    WHEN 'Critical' THEN 1
    WHEN 'High' THEN 2
    WHEN 'Medium' THEN 3
    WHEN 'Low' THEN 4
  END;
*/
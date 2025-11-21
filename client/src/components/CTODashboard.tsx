import React, { useState, useEffect } from 'react';
import { capacityAPI, ComponentData } from '../services/api';
import PriorityBadge from './PriorityBadge';
import CapacityIndicator from './CapacityIndicator';

const CTODashboard: React.FC = () => {
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await capacityAPI.getCTODashboard();
        setComponents(data);
      } catch (err) {
        setError('Failed to fetch CTO dashboard data');
        console.error('Error fetching CTO dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading CTO Dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <div className="dashboard-header">
        <h2>CTO视角 - 技术扩容方案</h2>
        <p>技术上哪些组件需要扩容，怎么扩？</p>
      </div>

      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-value">{components.filter(c => c.priority === 'P1').length}</div>
          <div className="stat-label">立即扩容 (P1)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{components.filter(c => c.priority === 'P2').length}</div>
          <div className="stat-label">近期扩容 (P2)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{components.reduce((sum, c) => sum + (c.workHours || 0), 0)}</div>
          <div className="stat-label">总工作量 (小时)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{components.length}</div>
          <div className="stat-label">监控组件总数</div>
        </div>
      </div>

      <div>
        {components.map((component) => (
          <div key={component.id} className="card">
            <div className="card-header">
              <h3 className="card-title">{component.componentName}</h3>
              <PriorityBadge priority={component.priority} />
            </div>
            
            <div className="card-content">
              <div className="metric">
                <CapacityIndicator usage={component.currentUsageP95} label="P95 使用率" />
              </div>
              
              <div className="metric">
                <CapacityIndicator usage={component.currentUsageP99} label="P99 使用率" />
              </div>
              
              <div className="metric">
                <div className="metric-label">预计饱和时间</div>
                <div className="metric-value">{component.predictedSaturationDate}</div>
              </div>
              
              <div className="metric">
                <div className="metric-label">工作量</div>
                <div className="metric-value">{component.workHours} 小时</div>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem', textAlign: 'left' }}>
              <div className="metric-label">扩容方案</div>
              <div style={{ marginTop: '0.5rem', color: '#2c3e50' }}>
                {component.expansionPlan}
              </div>
            </div>
            
            <div style={{ marginTop: '1rem', textAlign: 'left' }}>
              <div className="metric-label">预期效果</div>
              <div style={{ marginTop: '0.5rem', color: '#27ae60', fontWeight: 'bold' }}>
                {component.expectedImprovement}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CTODashboard;
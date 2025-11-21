import React, { useState, useEffect } from 'react';
import { capacityAPI, ComponentData } from '../services/api';

const CEODashboard: React.FC = () => {
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await capacityAPI.getCEODashboard();
        setComponents(data);
      } catch (err) {
        setError('Failed to fetch CEO dashboard data');
        console.error('Error fetching CEO dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRiskBadgeClass = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'Critical':
        return 'risk-critical';
      case 'High':
        return 'risk-high';
      case 'Medium':
        return 'risk-medium';
      case 'Low':
        return 'risk-low';
      default:
        return 'risk-low';
    }
  };

  if (loading) {
    return <div className="loading">Loading CEO Dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const criticalComponents = components.filter(c => c.riskLevel === 'Critical');
  const highRiskComponents = components.filter(c => c.riskLevel === 'High');

  return (
    <div>
      <div className="dashboard-header">
        <h2>CEO视角 - 业务风险评估</h2>
        <p>这会不会影响业务，值不值得扩容，什么时候必须扩？</p>
      </div>

      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#e74c3c' }}>{criticalComponents.length}</div>
          <div className="stat-label">紧急风险组件</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f39c12' }}>{highRiskComponents.length}</div>
          <div className="stat-label">高风险组件</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{components.filter(c => c.recommendation === '【必须立即扩容】').length}</div>
          <div className="stat-label">必须立即扩容</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{components.length}</div>
          <div className="stat-label">监控组件总数</div>
        </div>
      </div>

      {criticalComponents.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#e74c3c', marginBottom: '1rem' }}>🚨 紧急处理组件</h3>
          {criticalComponents.map((component) => (
            <div key={component.id} className="card" style={{ borderLeft: '4px solid #e74c3c' }}>
              <div className="card-header">
                <h3 className="card-title">{component.componentName}</h3>
                <span className={`risk-badge ${getRiskBadgeClass(component.riskLevel!)}`}>
                  {component.riskLevel}
                </span>
              </div>
              
              <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
                <div className="metric-label">业务影响</div>
                <div style={{ marginTop: '0.5rem', color: '#2c3e50', fontWeight: 'bold' }}>
                  {component.businessImpact}
                </div>
              </div>
              
              <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
                <div className="metric-label">用户影响</div>
                <div style={{ marginTop: '0.5rem', color: '#e74c3c' }}>
                  {component.userImpact}
                </div>
              </div>
              
              <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
                <div className="metric-label">必须完成截止时间</div>
                <div style={{ marginTop: '0.5rem', color: '#c0392b', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {component.deadline}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <span style={{ 
                  backgroundColor: '#c0392b', 
                  color: 'white', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}>
                  {component.recommendation}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <h3 style={{ marginBottom: '1rem' }}>全部组件风险评估</h3>
        {components.map((component) => (
          <div key={component.id} className="card">
            <div className="card-header">
              <h3 className="card-title">{component.componentName}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className={`risk-badge ${getRiskBadgeClass(component.riskLevel!)}`}>
                  {component.riskLevel}
                </span>
                <span style={{ 
                  backgroundColor: '#3498db', 
                  color: 'white', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  {component.priority}
                </span>
              </div>
            </div>
            
            <div className="card-content">
              <div className="metric">
                <div className="metric-label">业务影响</div>
                <div className="metric-value" style={{ fontSize: '0.9rem' }}>
                  {component.businessImpact}
                </div>
              </div>
              
              <div className="metric">
                <div className="metric-label">用户影响</div>
                <div className="metric-value" style={{ fontSize: '0.9rem' }}>
                  {component.userImpact}
                </div>
              </div>
              
              <div className="metric">
                <div className="metric-label">截止时间</div>
                <div className="metric-value">{component.deadline}</div>
              </div>
              
              <div className="metric">
                <div className="metric-label">决策建议</div>
                <div className="metric-value" style={{ 
                  color: component.recommendation === '【必须立即扩容】' ? '#e74c3c' : 
                         component.recommendation === '【建议近期扩容】' ? '#f39c12' : '#27ae60'
                }}>
                  {component.recommendation}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CEODashboard;
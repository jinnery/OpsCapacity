import React, { useState, useEffect } from 'react';
import { capacityAPI, ComponentData } from '../services/api';
import PriorityBadge from './PriorityBadge';
import CPUAnomalyDetails from './CPUAnomalyDetails';

const OpsEngineerDashboard: React.FC = () => {
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [selectedComponentForCPUDetails, setSelectedComponentForCPUDetails] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await capacityAPI.getOpsEngineerDashboard();
        setComponents(data);
      } catch (err) {
        setError('Failed to fetch Operations Engineer dashboard data');
        console.error('Error fetching Ops Engineer dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  if (loading) {
    return <div className="loading">Loading Operations Engineer Dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const totalWorkHours = components.reduce((sum, c) => sum + (c.totalWorkHours || 0), 0);
  const criticalComponents = components.filter(c => c.priority === 'P1');

  return (
    <div>
      <div className="dashboard-header">
        <h2>运维工程师视角 - 执行清单</h2>
        <p>具体怎么扩容，我需要做什么，需要多少时间？</p>
      </div>

      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-value">{totalWorkHours}</div>
          <div className="stat-label">总工作量 (小时)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#e74c3c' }}>{criticalComponents.length}</div>
          <div className="stat-label">紧急处理任务</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{components.length}</div>
          <div className="stat-label">待执行任务</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Math.ceil(totalWorkHours / 8)}</div>
          <div className="stat-label">预计工作日</div>
        </div>
      </div>

      {criticalComponents.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#e74c3c', marginBottom: '1rem' }}>🚨 紧急执行任务 (P1优先级)</h3>
          {criticalComponents.map((component) => (
            <div key={component.id} className="card" style={{ borderLeft: '4px solid #e74c3c' }}>
              <div className="card-header">
                <h3 className="card-title">{component.componentName}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <PriorityBadge priority={component.priority} />
                  <span style={{ 
                    backgroundColor: '#e74c3c', 
                    color: 'white', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}>
                    {component.totalWorkHours} 小时
                  </span>
                </div>
              </div>
              
              <div className="expansion-steps">
                <div className="metric-label">执行步骤</div>
                <ol>
                  {(component.expansionSteps || []).map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
              
              <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                <div className="metric-label">预期效果</div>
                <div style={{ marginTop: '0.5rem', color: '#27ae60', fontWeight: 'bold' }}>
                  {component.expectedOutcome}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <h3 style={{ marginBottom: '1rem' }}>全部执行任务</h3>
        {components.map((component) => {
          const isExpanded = expandedCard === component.id;
          
          return (
            <div 
              key={component.id} 
              className="card"
              style={{ cursor: 'pointer' }}
              onClick={() => toggleCard(component.id)}
            >
              <div className="card-header">
                <h3 className="card-title">{component.componentName}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <PriorityBadge priority={component.priority} />
                  <span style={{ 
                    backgroundColor: '#3498db', 
                    color: 'white', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}>
                    {component.totalWorkHours} 小时
                  </span>
                </div>
              </div>
              
              <div className="card-content">
                <div className="metric">
                  <div className="metric-label">P95使用率</div>
                  <div className="metric-value">{component.currentStatus?.usageP95}%</div>
                </div>
                <div className="metric">
                  <div className="metric-label">P99使用率</div>
                  <div className="metric-value">{component.currentStatus?.usageP99}%</div>
                </div>
                <div className="metric">
                  <div className="metric-label">饱和程度</div>
                  <span className={`priority-badge severity-${component.currentStatus?.saturationSeverity}`}>
                    {component.currentStatus?.saturationSeverity}
                  </span>
                </div>
                <div className="metric">
                  <div className="metric-label">预期效果</div>
                  <div className="metric-value" style={{ fontSize: '0.9rem' }}>
                    {component.expectedOutcome}
                  </div>
                </div>
              </div>
              
              {isExpanded && (
                <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                  <div style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    backgroundColor: '#f0f8ff',
                    borderLeft: '4px solid #3498db',
                    borderRadius: '4px'
                  }}>
                    <button
                      onClick={() => setSelectedComponentForCPUDetails({ id: component.id, name: component.componentName })}
                      style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2980b9')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3498db')}
                    >
                      📊 查看CPU异常详情
                    </button>
                  </div>

                  {selectedComponentForCPUDetails?.id === component.id && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <CPUAnomalyDetails
                        componentId={component.id}
                        componentName={component.componentName}
                        onClose={() => setSelectedComponentForCPUDetails(null)}
                      />
                    </div>
                  )}

                  <div className="expansion-steps">
                    <div className="metric-label">🔧 具体执行步骤</div>
                    <ol>
                      {(component.expansionSteps || []).map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div style={{ marginTop: '1.5rem' }}>
                    <div className="metric-label">✅ 验证方法</div>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                      {(component.verificationMethods || []).map((method, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>
                          {method}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ marginTop: '1.5rem' }}>
                    <div className="metric-label">⚠️ 可能遇到的问题</div>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                      {(component.potentialRisks || []).map((risk, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem', color: '#e74c3c' }}>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    backgroundColor: '#ecf0f1',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <strong>总工作量: {component.totalWorkHours} 小时</strong>
                  </div>
                </div>
              )}
              
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <span style={{ color: '#3498db', fontSize: '0.9rem' }}>
                  {isExpanded ? '点击收起详情 ▲' : '点击查看详情 ▼'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ 
        marginTop: '2rem', 
        backgroundColor: '#3498db', 
        color: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>工作量汇总</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>总工作量</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalWorkHours} 小时</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>预计工作日</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{Math.ceil(totalWorkHours / 8)} 天</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>紧急任务</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{criticalComponents.length} 个</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpsEngineerDashboard;
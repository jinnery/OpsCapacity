import React, { useState, useEffect } from 'react';
import { capacityAPI, OpsDirectorData, ComponentData } from '../services/api';
import PriorityBadge from './PriorityBadge';

const OpsDirectorDashboard: React.FC = () => {
  const [data, setData] = useState<OpsDirectorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await capacityAPI.getOpsDirectorDashboard();
        setData(response);
      } catch (err) {
        setError('Failed to fetch Operations Director dashboard data');
        console.error('Error fetching Ops Director dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading Operations Director Dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <div className="dashboard-header">
        <h2>运维总监视角 - 全局容量规划</h2>
        <p>全局容量规划，什么时候扩容，怎么安排？</p>
      </div>

      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-value">{data.sortedComponents.length}</div>
          <div className="stat-label">需要扩容组件</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.totalWorkHours}</div>
          <div className="stat-label">总工作量 (小时)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Math.ceil(data.totalWorkHours / 8)}</div>
          <div className="stat-label">所需人天</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.estimatedCompletion}天</div>
          <div className="stat-label">预计完成时间</div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>全局优先级排序</h3>
        <table className="table">
          <thead>
            <tr>
              <th>优先级</th>
              <th>组件名称</th>
              <th>预计饱和时间</th>
              <th>工作量</th>
              <th>所需资源</th>
              <th>计划周</th>
            </tr>
          </thead>
          <tbody>
            {data.sortedComponents.map((component) => (
              <tr key={component.id}>
                <td>
                  <PriorityBadge priority={component.priority} />
                </td>
                <td>{component.componentName}</td>
                <td>{component.saturationDate}</td>
                <td>{component.workHours} 小时</td>
                <td>{component.requiredResources}</td>
                <td>{component.completionWeek}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="weekly-plan">
        <h3 style={{ marginBottom: '1rem' }}>扩容时间表</h3>
        {Object.entries(data.weeklyPlan).map(([week, components]) => (
          <div key={week} className="week-section">
            <div className="week-title">{week}</div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {components.map((component) => (
                <div key={component.id} className="card" style={{ margin: 0 }}>
                  <div className="card-header">
                    <h4 style={{ margin: 0, color: '#2c3e50' }}>{component.componentName}</h4>
                    <PriorityBadge priority={component.priority} />
                  </div>
                  <div className="card-content">
                    <div className="metric">
                      <div className="metric-label">饱和时间</div>
                      <div className="metric-value">{component.saturationDate}</div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">工作量</div>
                      <div className="metric-value">{component.workHours} 小时</div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">所需资源</div>
                      <div className="metric-value">{component.requiredResources}</div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">剩余天数</div>
                      <div className="metric-value">{component.daysToSaturation} 天</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ecf0f1' }}>
              <strong>本周工作量: {components.reduce((sum, c) => sum + c.workHours, 0)} 小时</strong>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', backgroundColor: '#ecf0f1', padding: '1.5rem', borderRadius: '8px' }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>资源需求汇总</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <div className="metric-label">总工作量</div>
            <div className="metric-value">{data.totalWorkHours} 小时</div>
          </div>
          <div>
            <div className="metric-label">预计人天</div>
            <div className="metric-value">{Math.ceil(data.totalWorkHours / 8)} 人天</div>
          </div>
          <div>
            <div className="metric-label">建议工程师数</div>
            <div className="metric-value">{Math.ceil(data.totalWorkHours / 40)} 人</div>
          </div>
          <div>
            <div className="metric-label">完成周期</div>
            <div className="metric-value">{Math.ceil(data.estimatedCompletion / 7)} 周</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpsDirectorDashboard;
import React, { useState, useEffect } from 'react';
import { capacityAPI, ComponentDetailsResponse } from '../services/api';

interface CPUAnomalyDetailsProps {
  componentId: number;
  componentName: string;
  onClose: () => void;
}

const CPUAnomalyDetails: React.FC<CPUAnomalyDetailsProps> = ({ componentId, componentName, onClose }) => {
  const [details, setDetails] = useState<ComponentDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await capacityAPI.getComponentDetails(componentId.toString());
        setDetails(data);
      } catch (err) {
        setError('Failed to fetch CPU anomaly details');
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [componentId]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading CPU anomaly details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#e74c3c' }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!details) {
    return null;
  }

  const { cpuAnomalyDetails } = details;

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          🔍 CPU异常详情分析
        </h3>

        {cpuAnomalyDetails.hasAnomaly ? (
          <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            <p style={{ margin: '0', color: '#856404', fontWeight: 'bold' }}>
              ⚠️ 检测到异常: {cpuAnomalyDetails.anomalyType}
            </p>
            <p style={{ margin: '0.5rem 0 0 0', color: '#856404' }}>
              预计达到饱和: {cpuAnomalyDetails.daysToSaturation} 天
            </p>
            <p style={{ margin: '0.5rem 0 0 0', color: '#856404', fontSize: '0.875rem' }}>
              异常标记: <code>{cpuAnomalyDetails.anomalyMark}</code>
            </p>
          </div>
        ) : (
          <div style={{ backgroundColor: '#d4edda', border: '1px solid #28a745', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            <p style={{ margin: '0', color: '#155724', fontWeight: 'bold' }}>
              ✅ 未检测到异常 - 系统运行正常
            </p>
          </div>
        )}
      </div>

      {cpuAnomalyDetails.hasAnomaly && (
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>📊 业务影响对比</h4>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #ecf0f1',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <h5 style={{ color: '#27ae60', margin: '0 0 1rem 0' }}>✅ 正常期间</h5>
              <div style={{ fontSize: '0.9rem' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ color: '#7f8c8d', fontSize: '0.8rem' }}>平均 CPU 使用率</div>
                  <div style={{ color: '#2c3e50', fontWeight: 'bold', fontSize: '1.25rem' }}>
                    {cpuAnomalyDetails.normalPeriod.avg_cpu}%
                  </div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ color: '#7f8c8d', fontSize: '0.8rem' }}>P95 CPU 使用率</div>
                  <div style={{ color: '#2c3e50', fontWeight: 'bold', fontSize: '1.25rem' }}>
                    {cpuAnomalyDetails.normalPeriod.p95_cpu}%
                  </div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ color: '#7f8c8d', fontSize: '0.8rem' }}>平均延迟</div>
                  <div style={{ color: '#2c3e50', fontWeight: 'bold', fontSize: '1.25rem' }}>
                    {cpuAnomalyDetails.normalPeriod.latency_ms}ms
                  </div>
                </div>
                <div>
                  <div style={{ color: '#7f8c8d', fontSize: '0.8rem' }}>错误率</div>
                  <div style={{ color: '#2c3e50', fontWeight: 'bold', fontSize: '1.25rem' }}>
                    {(cpuAnomalyDetails.normalPeriod.error_rate * 100).toFixed(3)}%
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              border: '2px solid #e74c3c',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(231, 76, 60, 0.2)'
            }}>
              <h5 style={{ color: '#e74c3c', margin: '0 0 1rem 0' }}>🔴 异常期间</h5>
              <div style={{ fontSize: '0.9rem' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ color: '#7f8c8d', fontSize: '0.8rem' }}>平均 CPU 使用率</div>
                  <div style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '1.25rem' }}>
                    {cpuAnomalyDetails.anomalyPeriod.avg_cpu}%
                    <span style={{ color: '#e74c3c', marginLeft: '0.5rem', fontSize: '0.9rem' }}>
                      (+{cpuAnomalyDetails.comparison.avgCpuIncrease}%)
                    </span>
                  </div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ color: '#7f8c8d', fontSize: '0.8rem' }}>P95 CPU 使用率</div>
                  <div style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '1.25rem' }}>
                    {cpuAnomalyDetails.anomalyPeriod.p95_cpu}%
                    <span style={{ color: '#e74c3c', marginLeft: '0.5rem', fontSize: '0.9rem' }}>
                      (+{cpuAnomalyDetails.comparison.p95CpuIncrease}%)
                    </span>
                  </div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ color: '#7f8c8d', fontSize: '0.8rem' }}>平均延迟</div>
                  <div style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '1.25rem' }}>
                    {cpuAnomalyDetails.anomalyPeriod.latency_ms}ms
                    <span style={{ color: '#e74c3c', marginLeft: '0.5rem', fontSize: '0.9rem' }}>
                      (+{cpuAnomalyDetails.comparison.latencyIncrease}%)
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ color: '#7f8c8d', fontSize: '0.8rem' }}>错误率</div>
                  <div style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '1.25rem' }}>
                    {(cpuAnomalyDetails.anomalyPeriod.error_rate * 100).toFixed(3)}%
                    <span style={{ color: '#e74c3c', marginLeft: '0.5rem', fontSize: '0.9rem' }}>
                      (+{cpuAnomalyDetails.comparison.errorRateIncrease}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              border: '1px solid #ecf0f1',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <h5 style={{ color: '#2c3e50', margin: '0 0 1rem 0' }}>📈 增幅分析</h5>
              <div style={{ fontSize: '0.9rem' }}>
                <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#7f8c8d' }}>平均CPU增幅</span>
                  <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                    +{cpuAnomalyDetails.comparison.avgCpuIncrease}%
                  </span>
                </div>
                <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#7f8c8d' }}>P95增幅</span>
                  <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                    +{cpuAnomalyDetails.comparison.p95CpuIncrease}%
                  </span>
                </div>
                <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#7f8c8d' }}>延迟增幅</span>
                  <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                    +{cpuAnomalyDetails.comparison.latencyIncrease}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#7f8c8d' }}>错误率增幅</span>
                  <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                    +{cpuAnomalyDetails.comparison.errorRateIncrease}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {cpuAnomalyDetails.rawDataSamples && cpuAnomalyDetails.rawDataSamples.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>📋 原始数据样本 (支持验证)</h4>
          <div style={{
            overflowX: 'auto',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.9rem'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                  <th style={{ padding: '0.75rem', borderBottom: '2px solid #2c3e50' }}>时间戳</th>
                  <th style={{ padding: '0.75rem', borderBottom: '2px solid #2c3e50' }}>CPU使用率</th>
                  <th style={{ padding: '0.75rem', borderBottom: '2px solid #2c3e50' }}>延迟(ms)</th>
                  <th style={{ padding: '0.75rem', borderBottom: '2px solid #2c3e50' }}>错误数</th>
                </tr>
              </thead>
              <tbody>
                {cpuAnomalyDetails.rawDataSamples.map((sample, index) => (
                  <tr 
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #ecf0f1'
                    }}
                  >
                    <td style={{ padding: '0.75rem', color: '#2c3e50' }}>
                      {sample.timestamp}
                    </td>
                    <td style={{ 
                      padding: '0.75rem',
                      color: sample.cpu_usage > 70 ? '#e74c3c' : '#2c3e50',
                      fontWeight: sample.cpu_usage > 70 ? 'bold' : 'normal'
                    }}>
                      {sample.cpu_usage}%
                    </td>
                    <td style={{ 
                      padding: '0.75rem',
                      color: sample.latency > 200 ? '#e74c3c' : '#2c3e50',
                      fontWeight: sample.latency > 200 ? 'bold' : 'normal'
                    }}>
                      {sample.latency}
                    </td>
                    <td style={{ 
                      padding: '0.75rem',
                      color: sample.errors > 0 ? '#e74c3c' : '#27ae60',
                      fontWeight: sample.errors > 0 ? 'bold' : 'normal'
                    }}>
                      {sample.errors}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ 
        backgroundColor: '#ecf0f1', 
        borderRadius: '8px', 
        padding: '1rem',
        marginTop: '1.5rem'
      }}>
        <p style={{ margin: '0', color: '#2c3e50', fontSize: '0.9rem' }}>
          <strong>💡 数据说明:</strong> 上述数据对比清晰展示了异常期间对业务的实际影响。
          通过及时扩容，可以有效降低CPU使用率，改善延迟和错误率，提升用户体验。
        </p>
      </div>
    </div>
  );
};

export default CPUAnomalyDetails;

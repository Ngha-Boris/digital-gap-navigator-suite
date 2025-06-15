
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dimension } from '../types';
import { dimensionStates } from '../data/dimensionStates';
import { getGapColor } from '../utils/gapCalculation';
import { gapAnalysisAPI } from '../services/api';

const Dashboard: React.FC = () => {
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDimensions();
  }, []);

  const loadDimensions = async () => {
    try {
      const gapAnalysis = await gapAnalysisAPI.fetchGapAnalysis();
      setDimensions(gapAnalysis.dimensions);
    } catch (error) {
      console.error('Error loading dimensions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStateName = (dimensionName: string, level: number): string => {
    const states = dimensionStates[dimensionName];
    const state = states?.find(s => s.level === level);
    return state ? state.name : `Level ${level}`;
  };

  const getActionsCount = (dimension: Dimension): string => {
    const count = dimension.customizedActions.length;
    if (count === 0) return 'No actions';
    if (count === 1) return '1 action';
    return `${count} actions`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Digital Gap Analysis Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Assess your organization's digital maturity across key dimensions
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Dimensions Overview</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dimension
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Desired State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gap
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dimensions.map((dimension) => (
                  <tr
                    key={dimension.name}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/dimension/${encodeURIComponent(dimension.name)}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {dimension.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {dimension.currentState} - {getStateName(dimension.name, dimension.currentState)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {dimension.desiredState} - {getStateName(dimension.name, dimension.desiredState)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getGapColor(dimension.gap)}`}>
                        {dimension.gap}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getActionsCount(dimension)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

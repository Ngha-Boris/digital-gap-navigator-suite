import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dimension, Action, GapLevel } from '../types';
import { dimensionStates } from '../data/dimensionStates';
import { recommendations } from '../data/recommendations';
import { calculateGap, getGapColor } from '../utils/gapCalculation';
import { gapAnalysisAPI } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DimensionEdit: React.FC = () => {
  const { dimensionName } = useParams<{ dimensionName: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [dimension, setDimension] = useState<Dimension | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentState, setCurrentState] = useState<number>(1);
  const [desiredState, setDesiredState] = useState<number>(1);
  const [customizedActions, setCustomizedActions] = useState<Action[]>([]);
  const [newAction, setNewAction] = useState<string>('');
  const [newActionPriority, setNewActionPriority] = useState<Action['priority']>('IMPORTANT');

  const decodedDimensionName = dimensionName ? decodeURIComponent(dimensionName) : '';
  const states = dimensionStates[decodedDimensionName] || [];
  const gap: GapLevel = calculateGap(currentState, desiredState);
  const dimensionRecommendations = recommendations[decodedDimensionName]?.[gap];

  useEffect(() => {
    if (decodedDimensionName) {
      loadDimension();
    }
  }, [decodedDimensionName]);

  const loadDimension = async () => {
    try {
      const dimensionData = await gapAnalysisAPI.fetchDimension(decodedDimensionName);
      if (dimensionData) {
        setDimension(dimensionData);
        setCurrentState(dimensionData.currentState);
        setDesiredState(dimensionData.desiredState);
        setCustomizedActions([...dimensionData.customizedActions]);
      } else {
        // Create new dimension if not found
        const newDimension: Dimension = {
          name: decodedDimensionName,
          currentState: 1,
          desiredState: 1,
          gap: 'LOW',
          customizedActions: []
        };
        setDimension(newDimension);
      }
    } catch (error) {
      console.error('Error loading dimension:', error);
      toast({
        title: "Error",
        description: "Failed to load dimension data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateStates = (): boolean => {
    if (desiredState < currentState) {
      toast({
        title: "Invalid Selection",
        description: "Desired state cannot be lower than current state",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateStates()) return;

    setSaving(true);
    try {
      const updatedDimension: Dimension = {
        name: decodedDimensionName,
        currentState,
        desiredState,
        gap: calculateGap(currentState, desiredState),
        customizedActions
      };

      await gapAnalysisAPI.updateDimension(updatedDimension);
      
      toast({
        title: "Success",
        description: "Dimension updated successfully",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error saving dimension:', error);
      toast({
        title: "Error",
        description: "Failed to save dimension",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addCustomAction = () => {
    if (newAction.trim()) {
      setCustomizedActions([...customizedActions, { action: newAction.trim(), priority: newActionPriority }]);
      setNewAction('');
    }
  };

  const removeCustomAction = (index: number) => {
    setCustomizedActions(customizedActions.filter((_, i) => i !== index));
  };

  const getStateDescription = (level: number): string => {
    const state = states.find(s => s.level === level);
    return state ? state.description : '';
  };

  const getPriorityColor = (priority: Action['priority']): string => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'IMPORTANT':
        return 'bg-yellow-100 text-yellow-800';
      case 'FOLLOW UP':
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!states.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Dimension not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">{decodedDimensionName} Analysis</h1>
          <p className="mt-2 text-gray-600">Configure current and desired states for {decodedDimensionName}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* State Selection */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">State Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-state">Current State</Label>
                <Select value={currentState.toString()} onValueChange={(value) => setCurrentState(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.level} value={state.level.toString()}>
                        {state.level} - {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getStateDescription(currentState) && (
                  <p className="mt-2 text-sm text-gray-600">{getStateDescription(currentState)}</p>
                )}
              </div>

              <div>
                <Label htmlFor="desired-state">Desired State</Label>
                <Select value={desiredState.toString()} onValueChange={(value) => setDesiredState(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.level} value={state.level.toString()}>
                        {state.level} - {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getStateDescription(desiredState) && (
                  <p className="mt-2 text-sm text-gray-600">{getStateDescription(desiredState)}</p>
                )}
              </div>

              <div>
                <Label>Gap Assessment</Label>
                <div className="mt-2">
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getGapColor(gap)}`}>
                    {gap} Gap
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recommended Actions</h2>
            
            {dimensionRecommendations ? (
              <div>
                <div className="mb-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(dimensionRecommendations.priority)}`}>
                    {dimensionRecommendations.priority}
                  </span>
                </div>
                <ul className="space-y-3">
                  {dimensionRecommendations.actions.map((action, index) => (
                    <li key={index} className="text-sm text-gray-700 pl-4 border-l-2 border-blue-200">
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No recommendations available for this gap level.</p>
            )}
          </div>
        </div>

        {/* Custom Actions */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Customized Actions</h2>
          
          {/* Add New Action */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Add New Action</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Input
                  placeholder="Enter action description..."
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomAction()}
                />
              </div>
              <div className="flex gap-2">
                <Select value={newActionPriority} onValueChange={(value: Action['priority']) => setNewActionPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                    <SelectItem value="IMPORTANT">Important</SelectItem>
                    <SelectItem value="FOLLOW UP">Follow Up</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addCustomAction} disabled={!newAction.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Existing Actions */}
          <div className="space-y-3">
            {customizedActions.length === 0 ? (
              <p className="text-sm text-gray-500">No custom actions added yet.</p>
            ) : (
              customizedActions.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{action.action}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${getPriorityColor(action.priority)}`}>
                      {action.priority}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomAction(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DimensionEdit;

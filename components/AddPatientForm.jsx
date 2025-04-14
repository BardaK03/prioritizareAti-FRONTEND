import React, { useState, useEffect, useCallback } from 'react';
import { API_CONFIG } from '../config';

const AddPatientForm = ({ onAddPatient }) => {
  const [patientData, setPatientData] = useState({
    nume: '',
    gcs: '',
    tensiune: '',
    frecventaCardiaca: '',
    areVasopresoare: false,
    instabilHemodinamic: false,
    tipRespiratie: '',
    spo2: '',
    oxigenStabil: false,
    areInfectie: false,
    esteContagios: false,
    infectieControlata: false,
    sofa: '',
    apacheII: '',
    lactat: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [finalScore, setFinalScore] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPatientData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const requestData = getRequestData(patientData);

      const response = await fetch(`${API_CONFIG.BASE_URL}/pacients/addWithUpdateDTO`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add patient');
      }

      const responseData = await response.json();
      setSuccess(true);
      if (onAddPatient) {
        onAddPatient(responseData);
      }

      setPatientData({
        nume: '',
        gcs: '',
        tensiune: '',
        frecventaCardiaca: '',
        areVasopresoare: false,
        instabilHemodinamic: false,
        tipRespiratie: '',
        spo2: '',
        oxigenStabil: false,
        areInfectie: false,
        esteContagios: false,
        infectieControlata: false,
        sofa: '',
        apacheII: '',
        lactat: ''
      });
      setFinalScore(null);
    } catch (err) {
      console.error('Error submitting patient:', err);
      setError(err.message || 'Failed to add patient. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRequestData = (data) => ({
    nume: data.nume,
    gcs: data.gcs === '' ? 0 : Number(data.gcs),
    tensiune: data.tensiune === '' ? 0 : Number(data.tensiune),
    frecventaCardiaca: data.frecventaCardiaca === '' ? 0 : Number(data.frecventaCardiaca),
    areVasopresoare: data.areVasopresoare,
    instabilHemodinamic: data.instabilHemodinamic,
    tipRespiratie: data.tipRespiratie,
    spo2: data.spo2 === '' ? 0 : Number(data.spo2),
    oxigenStabil: data.oxigenStabil,
    areInfectie: data.areInfectie,
    esteContagios: data.esteContagios,
    infectieControlata: data.infectieControlata,
    sofa: data.sofa === '' ? 0 : Number(data.sofa),
    apacheII: data.apacheII === '' ? 0 : Number(data.apacheII),
    lactat: data.lactat === '' ? 0 : Number(data.lactat)
  });

  // Memoized version of areRequiredFieldsFilled function
  const areRequiredFieldsFilled = useCallback(() => {
    const requiredKeys = ['nume', 'gcs', 'tensiune', 'frecventaCardiaca', 'tipRespiratie', 'spo2', 'sofa', 'apacheII', 'lactat'];
    return requiredKeys.every(key => patientData[key] !== '');
  }, [patientData]); // Only recompute when patientData changes

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchScore = async () => {
        if (!areRequiredFieldsFilled()) {
          setFinalScore(null);
          return;
        }
        const getQueryParams = (data) => {
            const params = new URLSearchParams(getRequestData(data));
            return params.toString();
          };
          
        try {
            const queryString = getQueryParams(patientData);
            const response = await fetch(`${API_CONFIG.BASE_URL}/pacients/tryFinalScore?${queryString}`, {
              method: 'GET',
              
            });

  
          if (response.ok) {
            const score = await response.json();
            setFinalScore(score);
          } else {
            setFinalScore(null);
          }
        } catch (err) {
          console.error('Failed to fetch score:', err);
          setFinalScore(null);
        }
      };
  
      fetchScore();
    }, 500); // delay of 500ms
  
    return () => clearTimeout(delayDebounce);
  }, [patientData, areRequiredFieldsFilled]);
  
  

  return (
    <div className="w-full p-4 text-white">
      <div className="flex justify-between items-center mb-6 relative">
  <h2 className="text-xl font-bold">Add New Patient</h2>
  {finalScore !== null && (
    <div className="absolute right-0 top-0 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-lg font-bold">
      Final Score: {finalScore}
    </div>
  )}
</div>


      {error && (
        <div className="mb-4 p-3 bg-red-800 text-white rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-800/70 text-white px-4 py-2 rounded-md backdrop-blur-sm z-50 shadow-lg">
        Patient added successfully!
      </div>
      
      )}

<form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Name:</label>
          <input
            type="text"
            name="nume"
            value={patientData.nume}
            onChange={handleChange}
            required
            className="w-full bg-black-700 border border-gray-600 rounded-md p-2 text-white"
          />
        </div>

        {/* GCS Group */}
        <div className="bg-black-800 p-4 rounded-md border border-gray-700">
          <div>
            <label className="block text-sm font-medium mb-1">GCS Score:</label>
            <input
              type="number"
              name="gcs"
              value={patientData.gcs}
              onChange={handleChange}
              required
              min="3"
              max="15"
              className="w-full bg-black-700 border border-gray-600 rounded-md p-2 text-white"
            />
          </div>
        </div>

        {/* Hemodynamic Group */}
        <div className="bg-black-800 p-4 rounded-md border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Blood Pressure:</label>
              <input
                type="number"
                name="tensiune"
                value={patientData.tensiune}
                onChange={handleChange}
                required
                className="w-full bg-black-700 border border-gray-600 rounded-md p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Heart Rate:</label>
              <input
                type="number"
                name="frecventaCardiaca"
                value={patientData.frecventaCardiaca}
                onChange={handleChange}
                required
                className="w-full bg-black-700 border border-gray-600 rounded-md p-2 text-white"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="areVasopresoare"
                checked={patientData.areVasopresoare}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
              />
              <label className="ml-2 text-sm">Has Vasopressors</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="instabilHemodinamic"
                checked={patientData.instabilHemodinamic}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
              />
              <label className="ml-2 text-sm">Hemodynamic Instability</label>
            </div>
          </div>
        </div>

        {/* Respiratory Group */}
        <div className="bg-black-800 p-4 rounded-md border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type of Breathing:</label>
              <select
  name="tipRespiratie"
  value={patientData.tipRespiratie}
  onChange={handleChange}
  required
  className="w-full bg-black border border-gray-600 rounded-md p-2 text-white appearance-none"
  style={{ backgroundColor: "#1a1a1a" }}
>
  <option value="">Select</option>
  <option value="ventilation">Ventilation</option>
  <option value="spontaneous">Spontaneous</option>
  <option value="assisted">Assisted</option>
</select>

            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SpO2:</label>
              <input
                type="number"
                name="spo2"
                value={patientData.spo2}
                onChange={handleChange}
                required
                min="0"
                max="100"
                className="w-full bg-black-700 border border-gray-600 rounded-md p-2 text-white"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="oxigenStabil"
                checked={patientData.oxigenStabil}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
              />
              <label className="ml-2 text-sm">Stable Oxygen</label>
            </div>
          </div>
        </div>

        {/* Infection Group */}
        <div className="bg-black-800 p-4 rounded-md border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="areInfectie"
                checked={patientData.areInfectie}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
              />
              <label className="ml-2 text-sm">Has Infection</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="esteContagios"
                checked={patientData.esteContagios}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
              />
              <label className="ml-2 text-sm">Is Contagious</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="infectieControlata"
                checked={patientData.infectieControlata}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
              />
              <label className="ml-2 text-sm">Controlled Infection</label>
            </div>
          </div>
        </div>

        {/* Scores Group */}
        <div className="bg-black-800 p-4 rounded-md border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">SOFA:</label>
              <input
                type="number"
                name="sofa"
                value={patientData.sofa}
                onChange={handleChange}
                required
                className="w-full bg-black-700 border border-gray-600 rounded-md p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Apache II:</label>
              <input
                type="number"
                name="apacheII"
                value={patientData.apacheII}
                onChange={handleChange}
                required
                className="w-full bg-black-700 border border-gray-600 rounded-md p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lactate:</label>
              <input
                type="number"
                step="0.1"
                name="lactat"
                value={patientData.lactat}
                onChange={handleChange}
                required
                className="w-full bg-black-700 border border-black-600 rounded-md p-2 text-white"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
          disabled={isSubmitting}
          onClick={() => {
            setTimeout(() => {
              window.location.reload();
            }, 2500); // 1000ms = 1s
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Add Patient'}
        </button>
      </form>
    </div>
  );
};

export default AddPatientForm;

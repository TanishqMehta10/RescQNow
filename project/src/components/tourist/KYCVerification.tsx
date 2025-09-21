import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Camera, CheckCircle, ArrowLeft } from 'lucide-react';

const KYCVerification = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState({
    passport: null,
    photo: null
  });

  const handleFileUpload = (type: string, file: File) => {
    setUploadedFiles({
      ...uploadedFiles,
      [type]: file
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle KYC verification
    navigate('/tourist/digital-id');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="text-white hover:text-blue-200 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-white ml-4">KYC Verification</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Identity</h2>
              <p className="text-gray-600">Upload your documents to create your blockchain-based digital ID</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Passport/ID Upload */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">1. Upload Passport or National ID</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  {uploadedFiles.passport ? (
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="w-6 h-6" />
                      <span>Passport uploaded successfully</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Click to upload or drag and drop your passport/ID
                      </p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('passport', e.target.files[0])}
                        className="hidden"
                        id="passport-upload"
                      />
                      <label
                        htmlFor="passport-upload"
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
                      >
                        Choose File
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">2. Upload Your Photo</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  {uploadedFiles.photo ? (
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="w-6 h-6" />
                      <span>Photo uploaded successfully</span>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Upload a clear photo of yourself
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('photo', e.target.files[0])}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
                      >
                        Choose Photo
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-semibold text-blue-800 mb-3">Document Guidelines:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Documents should be clear and readable</li>
                  <li>• Accepted formats: JPG, PNG, PDF</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Ensure all text and details are visible</li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!uploadedFiles.passport || !uploadedFiles.photo}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Verify & Create Digital ID
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;
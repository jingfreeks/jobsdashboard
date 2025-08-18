import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOnboardingComplete, selectUserRoles } from "@/features/auth";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { RootState } from "@/config/store";

interface EducationEntry {
  id: string;
  level: string;
  schoolName: string;
  graduationYear: string;
}

interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  education: EducationEntry[];
  experience: string;
  skills: string[];
  bio: string;
  profilePicture: string;
}

interface OnboardingErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  education?: string;
  experience?: string;
  skills?: string;
  bio?: string;
  profilePicture?: string;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRoles = useSelector((state: RootState) => selectUserRoles(state));
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    education: [],
    experience: "",
    skills: [],
    bio: "",
    profilePicture: "",
  });

  const [errors, setErrors] = useState<OnboardingErrors>({});
  
  // State for managing education entries
  const [newEducation, setNewEducation] = useState<Omit<EducationEntry, 'id'>>({
    level: "",
    schoolName: "",
    graduationYear: "",
  });
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);

  const handleInputChange = (field: keyof OnboardingData, value: string | string[] | OnboardingData['education']) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: OnboardingErrors = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        break;
      case 2:
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
        break;
      case 3:
        if (formData.education.length === 0) {
          newErrors.education = "At least one education entry is required";
        }
        if (!formData.experience.trim()) newErrors.experience = "Experience is required";
        if (formData.skills.length === 0) newErrors.skills = "At least one skill is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save onboarding data to localStorage or Redux
    localStorage.setItem('onboardingData', JSON.stringify(formData));
    localStorage.setItem('onboardingComplete', 'true');
    
    // Update Redux state
    dispatch(setOnboardingComplete(true));
    
    // Redirect to appropriate dashboard based on user role
    const hasAdminRole = userRoles.some(role => 
      role.toLowerCase() === 'admin'
    );
    if (hasAdminRole) {
      navigate("/admin/dashboard");
    } else {
      navigate("/job-applicant/dashboard");
    }
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      handleInputChange('skills', [...formData.skills, skill.trim()]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    handleInputChange('skills', formData.skills.filter(skill => skill !== skillToRemove));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('profilePicture', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Education management functions
  const addEducation = () => {
    if (newEducation.level && newEducation.schoolName && newEducation.graduationYear) {
      const educationEntry: EducationEntry = {
        id: Date.now().toString(),
        ...newEducation,
      };
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, educationEntry]
      }));
      setNewEducation({ level: "", schoolName: "", graduationYear: "" });
      if (errors.education) {
        setErrors(prev => ({ ...prev, education: undefined }));
      }
    }
  };

  const editEducation = (id: string) => {
    const education = formData.education.find(edu => edu.id === id);
    if (education) {
      setNewEducation({
        level: education.level,
        schoolName: education.schoolName,
        graduationYear: education.graduationYear,
      });
      setEditingEducationId(id);
    }
  };

  const updateEducation = () => {
    if (editingEducationId && newEducation.level && newEducation.schoolName && newEducation.graduationYear) {
      setFormData(prev => ({
        ...prev,
        education: prev.education.map(edu => 
          edu.id === editingEducationId 
            ? { ...edu, ...newEducation }
            : edu
        )
      }));
      setNewEducation({ level: "", schoolName: "", graduationYear: "" });
      setEditingEducationId(null);
    }
  };

  const deleteEducation = (id: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const cancelEdit = () => {
    setNewEducation({ level: "", schoolName: "", graduationYear: "" });
    setEditingEducationId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Let's get to know you better</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Steps */}
        <div className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Address Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  data-testid="dob-input"
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your address"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="City"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="State"
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.zipCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="ZIP Code"
                  />
                  {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  data-testid="profile-picture-input-testId"
                  onChange={handleProfilePictureChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.profilePicture && (
                  <img 
                    src={formData.profilePicture} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover mt-2"
                    data-testid="profile-picture-preview"
                  />
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Education</h3>
                
                {/* Add/Edit Education Form */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-800 mb-3">
                    {editingEducationId ? 'Edit Education' : 'Add New Education'}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                      <select
                        value={newEducation.level}
                        data-testid="education-level-select-testId"
                        onChange={(e) => setNewEducation(prev => ({ ...prev, level: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Education Level</option>
                        <option value="Elementary">Elementary</option>
                        <option value="High School">High School</option>
                        <option value="College">College</option>
                        <option value="Post Graduate">Post Graduate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                      <input
                        type="text"
                        value={newEducation.schoolName}
                        data-testid="school-name-input-testId"
                        onChange={(e) => setNewEducation(prev => ({ ...prev, schoolName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter school name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year Graduated</label>
                      <input
                        type="number"
                        value={newEducation.graduationYear}
                        data-testid="graduation-year-input-testId"
                        onChange={(e) => setNewEducation(prev => ({ ...prev, graduationYear: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter graduation year"
                        min="1900"
                        max={new Date().getFullYear() + 10}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={editingEducationId ? updateEducation : addEducation}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      disabled={!newEducation.level || !newEducation.schoolName || !newEducation.graduationYear}
                    >
                      {editingEducationId ? 'Update' : 'Add'} Education
                    </button>
                    {editingEducationId && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Education List */}
                {formData.education.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Your Education</h4>
                    <div className="space-y-3">
                      {formData.education.map((edu) => (
                        <div data-testid="education-list" key={edu.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800">{edu.level}</h5>
                              <p className="text-gray-600">{edu.schoolName}</p>
                              <p className="text-sm text-gray-500">Graduated: {edu.graduationYear}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => editEducation(edu.id)}
                                className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteEducation(edu.id)}
                                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.education && <p className="text-red-500 text-xs mt-1">{errors.education}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={3}
                  placeholder="Tell us about your work experience"
                />
                {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a skill"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    data-testid="add-skill-button-testId"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addSkill(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                   
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
                    >
                      {skill}
                      <button
                        data-testid="skills-list-testId"
                        onClick={() => removeSkill(skill)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  data-testid="bio-input-testId"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition ${
              currentStep === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {currentStep === 3 ? 'Complete' : 'Next'}
            {currentStep !== 3 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding; 
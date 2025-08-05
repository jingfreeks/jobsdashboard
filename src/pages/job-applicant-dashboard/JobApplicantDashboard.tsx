import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthMonitor } from "@/components/AuthMonitor";
import { Header } from "../admin-dashboard/component";
import { Search, MapPin, Briefcase, Clock, DollarSign, Building, Bookmark, Share2, Filter, Home, User, FileText, Settings, Bell, Heart, Calendar, MessageSquare } from "lucide-react";

const JobApplicantDashboard = () => {
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogout = async () => {
    await logout(true);
  };

  const handleSearch = () => {
    // TODO: Implement job search functionality
    alert('Job search functionality will be implemented here');
  };

  const handleApply = (jobId: string) => {
    // TODO: Implement job application functionality
    alert(`Application submitted for job: ${jobId}`);
  };

  const handleSaveJob = (jobId: string) => {
    // TODO: Implement save job functionality
    alert(`Job saved: ${jobId}`);
  };

  const handleShareJob = (jobId: string) => {
    // TODO: Implement share job functionality
    alert(`Job shared: ${jobId}`);
  };

  return (
    <>
      <AuthMonitor />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header handleLogout={handleLogout} />
        
        {/* Hero Search Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">Find Your Dream Job</h1>
              <p className="text-xl text-blue-100">Discover opportunities that match your skills and career goals</p>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Job title, keywords, or company"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="City, state, or remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select 
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Job Type</option>
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <button 
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Search Jobs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex">
          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 min-h-screen`}>
            <div className="p-4">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between mb-6">
                {sidebarOpen && <h2 className="text-lg font-bold text-gray-800">Job Dashboard</h2>}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    activeSection === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  {sidebarOpen && <span>Dashboard</span>}
                </button>

                <button
                  onClick={() => setActiveSection('profile')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    activeSection === 'profile' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5" />
                  {sidebarOpen && <span>Profile</span>}
                </button>

                <button
                  onClick={() => setActiveSection('applications')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    activeSection === 'applications' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  {sidebarOpen && <span>Applications</span>}
                </button>

                <button
                  onClick={() => setActiveSection('saved')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    activeSection === 'saved' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  {sidebarOpen && <span>Saved Jobs</span>}
                </button>

                <button
                  onClick={() => setActiveSection('interviews')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    activeSection === 'interviews' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  {sidebarOpen && <span>Interviews</span>}
                </button>

                <button
                  onClick={() => setActiveSection('messages')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    activeSection === 'messages' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  {sidebarOpen && <span>Messages</span>}
                </button>

                <button
                  onClick={() => setActiveSection('notifications')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    activeSection === 'notifications' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {sidebarOpen && <span>Notifications</span>}
                </button>

                <button
                  onClick={() => setActiveSection('settings')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    activeSection === 'settings' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  {sidebarOpen && <span>Settings</span>}
                </button>
              </nav>

              {/* Quick Stats */}
              {sidebarOpen && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Quick Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Applications</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saved Jobs</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interviews</span>
                      <span className="font-medium">3</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Filters - Only show in dashboard section */}
              {sidebarOpen && activeSection === 'dashboard' && (
                <div className="mt-6 p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-800 text-sm">Filters</h3>
                  </div>
                  
                  {/* Salary Range */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 text-xs mb-2">Salary Range</h4>
                    <div className="space-y-1">
                      {['$0 - $50k', '$50k - $100k', '$100k - $150k', '$150k+'].map((range) => (
                        <label key={range} className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3 h-3" />
                          <span className="ml-2 text-xs text-gray-600">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 text-xs mb-2">Experience Level</h4>
                    <div className="space-y-1">
                      {['Entry Level', 'Mid Level', 'Senior', 'Executive'].map((level) => (
                        <label key={level} className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3 h-3" />
                          <span className="ml-2 text-xs text-gray-600">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Remote Work */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 text-xs mb-2">Remote Work</h4>
                    <div className="space-y-1">
                      {['Remote', 'Hybrid', 'On-site'].map((type) => (
                        <label key={type} className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3 h-3" />
                          <span className="ml-2 text-xs text-gray-600">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Job Listings */}
              <div className="w-full">
                {activeSection === 'dashboard' && (
                  <>
                    {/* Results Header */}
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Recommended Jobs</h2>
                        <p className="text-gray-600">Based on your profile and preferences</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        Showing 1-12 of 1,234 jobs
                      </div>
                    </div>

                    {/* Job Cards */}
                    <div className="space-y-4">
                {/* Job Card 1 */}
                <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                          Senior Software Engineer
                        </h3>
                        <p className="text-gray-600 flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          TechCorp Inc.
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            San Francisco, CA
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Full-time
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            $120k - $150k
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveJob('job-1')}
                        className="p-2 text-gray-400 hover:text-blue-600 transition"
                        title="Save job"
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleShareJob('job-1')}
                        className="p-2 text-gray-400 hover:text-blue-600 transition"
                        title="Share job"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    We are looking for an experienced software engineer to join our team and help build scalable applications. 
                    You'll work with cutting-edge technologies and collaborate with talented engineers.
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Remote</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">React</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Node.js</span>
                    </div>
                    <button 
                      onClick={() => handleApply('job-1')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>

                {/* Job Card 2 */}
                <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                          Product Manager
                        </h3>
                        <p className="text-gray-600 flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          InnovateTech
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            New York, NY
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Full-time
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            $100k - $130k
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveJob('job-2')}
                        className="p-2 text-gray-400 hover:text-blue-600 transition"
                        title="Save job"
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleShareJob('job-2')}
                        className="p-2 text-gray-400 hover:text-blue-600 transition"
                        title="Share job"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    Join our product team to help shape the future of our platform and drive product strategy. 
                    You'll work closely with engineering, design, and business teams.
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Hybrid</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Product</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Strategy</span>
                    </div>
                    <button 
                      onClick={() => handleApply('job-2')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>

                {/* Job Card 3 */}
                <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                          UX Designer
                        </h3>
                        <p className="text-gray-600 flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          DesignStudio
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            Austin, TX
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Full-time
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            $80k - $110k
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveJob('job-3')}
                        className="p-2 text-gray-400 hover:text-blue-600 transition"
                        title="Save job"
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleShareJob('job-3')}
                        className="p-2 text-gray-400 hover:text-blue-600 transition"
                        title="Share job"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    Create beautiful and intuitive user experiences for our products and collaborate with cross-functional teams. 
                    You'll work on both web and mobile applications.
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Remote</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Figma</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">UI/UX</span>
                    </div>
                    <button 
                      onClick={() => handleApply('job-3')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>

                {/* Job Card 4 */}
                <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                          Data Scientist
                        </h3>
                        <p className="text-gray-600 flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          DataCorp
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            Remote
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Full-time
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            $90k - $120k
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveJob('job-4')}
                        className="p-2 text-gray-400 hover:text-blue-600 transition"
                        title="Save job"
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleShareJob('job-4')}
                        className="p-2 text-gray-400 hover:text-blue-600 transition"
                        title="Share job"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    Analyze complex data sets and develop machine learning models to drive business insights. 
                    You'll work with large-scale data and cutting-edge ML technologies.
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Remote</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Python</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">ML</span>
                    </div>
                    <button 
                      onClick={() => handleApply('job-4')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>

                    {/* Load More Button */}
                    <div className="text-center mt-8">
                      <button className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition font-medium">
                        Load More Jobs
                      </button>
                    </div>
                    </>
                  )}

                  {/* Applications Section */}
                  {activeSection === 'applications' && (
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
                          <p className="text-gray-600">Track your job application status</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          Total Applications: 12
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">Frontend Developer</h3>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Submitted</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">WebSolutions • Remote</p>
                          <p className="text-gray-500 text-xs">Applied 2 days ago</p>
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Application ID: #APP-001</span>
                              <button className="text-blue-600 hover:text-blue-800">View Details</button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">Data Analyst</h3>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Reviewing</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">DataCorp • Chicago, IL</p>
                          <p className="text-gray-500 text-xs">Applied 1 week ago</p>
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Application ID: #APP-002</span>
                              <button className="text-blue-600 hover:text-blue-800">View Details</button>
                            </div>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">Marketing Specialist</h3>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Interview</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">GrowthCo • Los Angeles, CA</p>
                          <p className="text-gray-500 text-xs">Applied 3 days ago</p>
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Application ID: #APP-003</span>
                              <button className="text-blue-600 hover:text-blue-800">View Details</button>
                            </div>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">UX Designer</h3>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Shortlisted</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">DesignStudio • Austin, TX</p>
                          <p className="text-gray-500 text-xs">Applied 5 days ago</p>
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Application ID: #APP-004</span>
                              <button className="text-blue-600 hover:text-blue-800">View Details</button>
                            </div>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">Product Manager</h3>
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Rejected</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">InnovateTech • New York, NY</p>
                          <p className="text-gray-500 text-xs">Applied 2 weeks ago</p>
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Application ID: #APP-005</span>
                              <button className="text-blue-600 hover:text-blue-800">View Details</button>
                            </div>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">Software Engineer</h3>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Submitted</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">TechCorp • San Francisco, CA</p>
                          <p className="text-gray-500 text-xs">Applied 1 day ago</p>
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Application ID: #APP-006</span>
                              <button className="text-blue-600 hover:text-blue-800">View Details</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default JobApplicantDashboard; 
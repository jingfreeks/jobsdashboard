import { memo } from "react";
import { X, Upload } from "lucide-react";

interface CityModalProps {
  isOpen: boolean;
  title: string;
  cityName: string;
  selectedStateId: string;
  selectedImage?: File | null;
  imagePreview?: string | null;
  states: Array<{ _id: string; name: string }> | undefined;
  onCityNameChange: (name: string) => void;
  onStateChange: (stateId: string) => void;
  onImageChange?: (file: File | null) => void;
  onImagePreviewChange?: (preview: string | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isLoading: boolean;
  isUploading?: boolean;
  submitText: string;
  showImageUpload?: boolean;
}

const CityModal = memo<CityModalProps>(({ 
  isOpen, 
  title, 
  cityName, 
  selectedStateId, 
  imagePreview, 
  states, 
  onCityNameChange, 
  onStateChange, 
  onImageChange, 
  onImagePreviewChange, 
  onSubmit, 
  onClose, 
  isLoading, 
  isUploading = false,
  submitText,
  showImageUpload = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl font-bold"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-slate-800">
          {title}
        </h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="City Name"
            value={cityName}
            onChange={(e) => onCityNameChange(e.target.value)}
            autoFocus
            required
            disabled={isLoading}
          />
          <select
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            value={selectedStateId}
            onChange={(e) => onStateChange(e.target.value)}
            disabled={isLoading}
          >
            <option value="">Select State</option>
            {states?.map((state) => (
              <option key={state._id} value={state._id}>
                {state.name}
              </option>
            ))}
          </select>
          
          {/* Image Upload - only show for add modal */}
          {showImageUpload && onImageChange && onImagePreviewChange && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">City Image</label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onImageChange(null);
                      onImagePreviewChange(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onImageChange(file);
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          onImagePreviewChange(e.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                    id="image-upload"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer text-sm text-slate-600 hover:text-blue-600"
                  >
                    Click to upload image
                  </label>
                </div>
              )}
            </div>
          )}
          
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
              disabled={isLoading || isUploading}
            >
              {isLoading || isUploading ? 'Processing...' : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

CityModal.displayName = 'CityModal';

export default CityModal; 
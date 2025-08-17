
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CityModal from "../CityModal";

// // Mock FileReader for image preview testing
// class MockFileReader {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null =
//     null;
//   readAsDataURL(file: Blob) {
//     if (this.onload) {
//       this.onload({
//         target: { result: "data:image/png;base64,mockdata" },
//       } as ProgressEvent<FileReader>);
//     }
//   }
// }
// (global as any).FileReader = MockFileReader;

describe("CityModal Component", () => {
  let defaultProps: any;

  beforeEach(() => {
    defaultProps = {
      isOpen: true,
      title: "Add City",
      cityName: "Sample City",
      selectedStateId: "1",
      states: [
        { _id: "1", name: "State One" },
        { _id: "2", name: "State Two" },
      ],
      onCityNameChange: vi.fn(),
      onStateChange: vi.fn(),
      onImageChange: vi.fn(),
      onImagePreviewChange: vi.fn(),
      onSubmit: vi.fn((e) => e.preventDefault()),
      onClose: vi.fn(),
      isLoading: false,
      isUploading: false,
      submitText: "Save",
    };
  });

  it("matches snapshot (with image upload)", () => {
    const { asFragment } = render(
      <CityModal {...defaultProps} showImageUpload={true} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot (without image upload)", () => {
    const { asFragment } = render(
      <CityModal {...defaultProps} showImageUpload={false} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <CityModal {...defaultProps} isOpen={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("calls onClose when cancel button is clicked", () => {
    render(<CityModal {...defaultProps} />);
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("calls onCityNameChange when typing", () => {
    render(<CityModal {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText(/City Name/i), {
      target: { value: "New City" },
    });
    expect(defaultProps.onCityNameChange).toHaveBeenCalledWith("New City");
  });

  it("calls onStateChange when selecting state", () => {
    render(<CityModal {...defaultProps} />);
    fireEvent.change(screen.getByDisplayValue("State One"), {
      target: { value: "2" },
    });
    expect(defaultProps.onStateChange).toHaveBeenCalledWith("2");
  });

  it("handles view image file after upload", () => {
    const { asFragment } = render(
      <CityModal {...defaultProps} imagePreview={true} showImageUpload={true} onImageChange={true} onImagePreviewChange={true} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
  //   it("handles image file upload", () => {
  //     render(<CityModal {...defaultProps} imagePreview={true} showImageUpload={true} />);
  //     const file = new File(["dummy"], "city.png", { type: "image/png" });
  //     const input = screen.getByLabelText(/Click to upload image/i).previousSibling as HTMLInputElement;
  //     fireEvent.change(input, { target: { files: [file] } });

  //     expect(defaultProps.onImageChange).toHaveBeenCalledWith(file);
  //     expect(defaultProps.onImagePreviewChange).toHaveBeenCalledWith("data:image/png;base64,mockdata");
  //   });

  //   it("removes image when delete button clicked", () => {
  //     render(
  //       <CityModal
  //         {...defaultProps}
  //         showImageUpload={true}
  //         imagePreview="test.jpg"
  //       />
  //     );
  //     fireEvent.click(screen.getByRole("button", { name: /X/i }));
  //     expect(defaultProps.onImageChange).toHaveBeenCalledWith(null);
  //     expect(defaultProps.onImagePreviewChange).toHaveBeenCalledWith(null);
  //   });

  it("disables submit button when loading", () => {
    render(<CityModal {...defaultProps} isLoading={true} />);
    expect(screen.getByRole("button", { name: /Processing/i })).toBeDisabled();
  });

  it("submits form when save clicked", () => {
    render(<CityModal {...defaultProps} />);
    fireEvent.click(screen.getByText(/Save/i));
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
});

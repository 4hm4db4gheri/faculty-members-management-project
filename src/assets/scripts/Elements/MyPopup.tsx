import { useState, useEffect } from "react";
import { toast } from "react-toastify"; // Import toast

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: "pdf" | "excel";
  onUpload: (file: File) => void;
}

export default function MyPopup({
  isOpen,
  onClose,
  type,
  onUpload,
}: PopupProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Reset selectedFile when popup is closed or opened
  useEffect(() => {
    setSelectedFile(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (type === "pdf" && file.type !== "application/pdf") {
      toast.error("لطفا فقط فایل PDF انتخاب کنید"); // Replaced alert
      return;
    }
    if (
      type === "excel" &&
      ![
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ].includes(file.type)
    ) {
      toast.error("لطفا فقط فایل Excel انتخاب کنید"); // Replaced alert
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      toast.success("فایل با موفقیت بارگذاری شد!"); // Success toast
      setSelectedFile(null); // Reset after upload
      onClose();
    } else {
      toast.warn("لطفا ابتدا فایل را انتخاب کنید"); // Replaced alert
    }
  };

  return (
    <>
      {/* Overlay with 50% opacity */}
      <div
        className="fixed inset-0 z-40 bg-[#282828] opacity-50"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 z-50 w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-[25px] bg-[#EBF2FA] p-6 text-black shadow-lg">
        {/* Row 1 - Title */}
        <div className="mb-6 text-center text-lg">
          {type === "pdf" ? "محل آپلود پی دی اف" : "محل آپلود اکسل"}
        </div>

        {/* Row 2 - Upload Controls */}
        <div className="grid grid-cols-3 gap-4">
          {/* Submit Button - Takes 1 column */}
          <button
            onClick={handleSubmit}
            className="col-span-1 rounded-[25px] bg-[#3388BC] px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#2D77A8]"
          >
            ارسال
          </button>

          {/* File Input - Takes 2 columns */}
          <div className="col-span-2 flex items-center">
            <input
              type="file"
              accept={type === "pdf" ? ".pdf" : ".xls,.xlsx"}
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="flex w-full cursor-pointer items-center justify-center truncate rounded-[25px] bg-white px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 transition-colors duration-300 hover:bg-gray-50"
              title={selectedFile?.name || "انتخاب فایل"}
            >
              {selectedFile?.name || "انتخاب فایل"}
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

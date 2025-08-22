import { Download, FileText, Image, File } from "lucide-react";
import { useSelector } from "react-redux";
import FileUpload from "./FileUpload";
import { format } from "date-fns";
const getFileIcon = (type) => {
  switch (type) {
    case "pdf":
      return <FileText className="text-red-500" size={24} />;
    case "jpg":
      return <Image className="text-blue-400" size={24} />;
    case "text":
      return <FileText className="text-green-400" size={24} />;
    default:
      return <File className="text-white" size={24} />;
  }
};

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = parseFloat((bytes / Math.pow(1024, i)).toFixed(2));
  return `${size} ${sizes[i]}`;
}

const FilesPage = () => {
  const { currentProject } = useSelector((state) => state.project);
  const { user } = useSelector((state) => state.auth);
  const { owner } = currentProject;
  return (
    <div className="min-h-screen bg-space-900 text-white px-6 py-10">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {currentProject.files.map((file) => (
            <div
              key={file._id}
              className="bg-gray-1000 p-5 rounded-2xl border border-gray-800 shadow-md flex flex-col justify-between"
            >
              <div className="flex items-center gap-4 mb-4 overflow-hidden">
                <div className="bg-gray-900 p-2 rounded-lg">
                  {getFileIcon(file.format)}
                </div>
                <div>
                  <p className="font-medium text-sm truncate">{file.name}</p>
                  <p className="text-gray-400 text-xs">
                    {formatBytes(file.size)} • Uploaded on{" "}
                    {format(
                      new Date(file.uploadedAt || "2025-06-08T13:30:13.000Z"),
                      "MMM d, yyyy"
                    )}
                  </p>
                </div>
              </div>
              <a
                href={file.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition text-sm font-medium"
              >
                <Download size={16} />
                Download
              </a>
            </div>
          ))}
        </div>
        {user.id === owner._id && <FileUpload />}
      </div>
    </div>
  );
};

export default FilesPage;

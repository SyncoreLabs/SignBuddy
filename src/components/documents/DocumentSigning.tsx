import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { format } from "date-fns";
import creditsIcon from "../../assets/images/credits-icon.png";
interface Agreement {
  documentKey: string;
  title: string;
  documentUrl: string[];
  status: string;
  recipients: Array<{
    email: string;
    name: string;
    recipientsAvatar?: string;
    updates?: string;
  }>;
  placeholders: Array<PlaceholderData>;
}
interface PlaceholderData {
  placeholderNumber: number;
  position: {
    x: string;
    y: string;
  };
  type: "signature" | "date" | "text";
  size: {
    width: string;
    height: string;
  };
  assignedTo: string;
  email: string;
  pageNumber: number;
}

interface UserData {
  user: {
    email: string;
    userName: string;
    avatar: string;
    credits: number;
  };
}

interface SignaturePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: string) => void;
  type: "signature" | "date" | "text";
}


const SignaturePopup: React.FC<SignaturePopupProps> = ({
  isOpen,
  onClose,
  onSave,
  type,
}) => {
  const [activeTab, setActiveTab] = useState<"text" | "draw" | "upload">(
    type === "text" ? "text" : "draw"
  );
  const [signatureText, setSignatureText] = useState("");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const signatureRef = useRef<SignatureCanvas>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [selectedFont, setSelectedFont] = useState("font-dancing-script");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);


  // Modify the return condition to handle both signature and date types
  if (!isOpen) return null;

  if (type === "date") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div ref={popupRef} className="bg-black rounded-lg w-[400px] p-4 border border-white/20">
          <h2 className="text-white text-lg mb-4">Select Date</h2>
          <input
            type="date"
            className="w-full p-2 rounded-lg bg-white text-black mb-4"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-100"
              onClick={() => {
                onSave(format(selectedDate, "MM/dd/yyyy"));
                onClose();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (type === "text") {
    return (

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div ref={popupRef} className="bg-black rounded-lg w-[400px] p-4 border border-white/20">
          <h2 className="text-white text-lg mb-4">Enter Text</h2>
          <input
            type="text"
            value={signatureText}
            onChange={(e) => setSignatureText(e.target.value)}
            placeholder="Enter your text"
            className="w-full p-3 bg-black text-white rounded-lg border border-white/20 mb-4 text-lg"
          />
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-100"
              onClick={() => {
                onSave(signatureText);
                onClose();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div ref={popupRef} className="bg-black rounded-lg w-[400px] md:w-[600px] p-2 border border-white/20">
      
        {/* Signature popup content */}
        <div className="flex justify-between mb-4">
          <div className="flex w-full gap-2">
            <button
              className={`flex-1 py-2 rounded-lg text-lg transition-colors ${activeTab === "text"
                ? "bg-white text-black"
                : "text-gray-500 hover:text-white"
                }`}
              onClick={() => setActiveTab("text")}
            >
              Text
            </button>
            <button
              className={`flex-1 py-2 rounded-lg text-lg transition-colors ${activeTab === "draw"
                ? "bg-white text-black"
                : "text-gray-500 hover:text-white"
                }`}
              onClick={() => setActiveTab("draw")}
            >
              Draw
            </button>
            <button
              className={`flex-1 py-2 rounded-lg text-lg transition-colors ${activeTab === "upload"
                ? "bg-white text-black"
                : "text-gray-500 hover:text-white"
                }`}
              onClick={() => setActiveTab("upload")}
            >
              Upload
            </button>
          </div>
        </div>
        <div className="h-0.5 bg-white/20 mb-1"></div>

        <div className="text-gray-400 text-sm mb-2">
          {activeTab === "draw"}
          {activeTab === "text"}
          {activeTab === "upload"}
        </div>

        <div className="bg-white rounded-lg h-[300px] mb-4">
          {activeTab === "text" && (
            <div className="flex flex-col p-1 h-full bg-black">
              <input
                type="text"
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                placeholder="Bharath Chandra"
                className="w-full p-3 bg-black text-white rounded-lg border border-white/20 mb-4 text-lg"
              />

              <div className="flex items-center gap-2 mb-4 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">Select one from below</span>
              </div>

              <div className="grid bg-white p-1 rounded-lg grid-cols-2 gap-3">
                <button
                  className={`p-3 bg-white rounded-lg text-black ${selectedFont === "font-dancing-script"
                    ? "border-2 border-black"
                    : "border-2"
                    } font-dancing-script`}
                  onClick={() => setSelectedFont("font-dancing-script")}
                >
                  {signatureText || "Bharath Chandra"}
                </button>
                <button
                  className={`p-3 bg-white rounded-lg text-black ${selectedFont === "font-great-vibes"
                    ? "border-2 border-black"
                    : "border-2"
                    } font-great-vibes`}
                  onClick={() => setSelectedFont("font-great-vibes")}
                >
                  {signatureText || "Bharath Chandra"}
                </button>
                <button
                  className={`p-3 bg-white rounded-lg text-black ${selectedFont === "font-alex-brush"
                    ? "border-2 border-black"
                    : "border-2"
                    } font-alex-brush`}
                  onClick={() => setSelectedFont("font-alex-brush")}
                >
                  {signatureText || "Bharath Chandra"}
                </button>
                <button
                  className={`p-3 bg-white rounded-lg text-black ${selectedFont === "font-sacramento"
                    ? "border-2 border-black"
                    : "border-2"
                    } font-sacramento`}
                  onClick={() => setSelectedFont("font-sacramento")}
                >
                  {signatureText || "Bharath Chandra"}
                </button>
                <button
                  className={`p-3 bg-white rounded-lg text-black ${selectedFont === "font-allura"
                    ? "border-2 border-black"
                    : "border-2"
                    } font-allura`}
                  onClick={() => setSelectedFont("font-allura")}
                >
                  {signatureText || "Bharath Chandra"}
                </button>
                <button
                  className={`p-3 bg-white rounded-lg text-black ${selectedFont === "font-petit-formal"
                    ? "border-2 border-black"
                    : "border-2"
                    } font-petit-formal`}
                  onClick={() => setSelectedFont("font-petit-formal")}
                >
                  {signatureText || "Bharath Chandra"}
                </button>
              </div>
            </div>
          )}
          {activeTab === "draw" && (
            <div className="flex flex-col h-full bg-black">
              <div className="flex items-center gap-2 m-1 mb-3 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">Draw in the below area</span>
              </div>

              <div
                className="flex-1 bg-[#f9f9f9] rounded-lg mb-4 relative overflow-hidden"
                style={{ height: "200px" }}
              >
                <SignatureCanvas
                  ref={signatureRef}
                  penColor={selectedColor}
                  canvasProps={{
                    width: 580,
                    height: 200,
                    className: "signature-canvas",
                    style: { backgroundColor: "#f9f9f9" },
                  }}
                />
                <div className="h-0.5 mx-3 bg-black/20"></div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center m-3 gap-2">
                    <span className="text-gray-400">Colors</span>
                    <button
                      className={`w-4 h-4 rounded-full bg-black border border-white/20 ${selectedColor === "#000000"
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#242424]"
                        : ""
                        }`}
                      onClick={() => setSelectedColor("#000000")}
                    />
                    <button
                      className={`w-4 h-4 rounded-full bg-red-500 ${selectedColor === "#EF4444"
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#242424]"
                        : ""
                        }`}
                      onClick={() => setSelectedColor("#EF4444")}
                    />
                    <button
                      className={`w-4 h-4 rounded-full bg-green-500 ${selectedColor === "#22C55E"
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#242424]"
                        : ""
                        }`}
                      onClick={() => setSelectedColor("#22C55E")}
                    />
                  </div>
                  <button
                    className="text-gray-400 m-3 hover:text-white"
                    onClick={() => {
                      if (signatureRef.current) {
                        signatureRef.current.clear();
                      }
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === "upload" && (
            <div className="flex flex-col h-full bg-black p-4 pb-0 pt-0">
              <div className="flex items-center gap-2 mb-2 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">
                  Supported formats - JPG/JPEG/PNG
                </span>
              </div>

              <div
                className="flex-1 bg-white rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                onClick={() => !previewUrl && fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreviewUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <div className="flex flex-col items-center">
                  {previewUrl ? (
                    <div className="flex flex-col w-full">
                      <div className="relative flex-1 mb-4">
                        <img
                          src={previewUrl}
                          alt="Signature preview"
                          className="max-h-[200px] w-full object-contain mb-2 transition-transform"
                          style={{
                            transform: `scale(${zoom}) rotate(${rotation}deg)`,
                            transformOrigin: "center",
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-3 px-4">
                        <div className="flex gap-4 px-4">
                          <div className="flex items-center flex-1 text-black text-sm">
                            <span className="mr-2">zoom</span>
                            <input
                              type="range"
                              min="0.2"
                              max="1.2"
                              step="0.1"
                              value={zoom}
                              onChange={(e) =>
                                setZoom(parseFloat(e.target.value))
                              }
                              className="flex-1 accent-black"
                            />
                          </div>
                          <div className="flex items-center flex-1 text-black text-sm">
                            <span className="mr-2">rotate</span>
                            <input
                              type="range"
                              min="0"
                              max="360"
                              step="1"
                              value={rotation}
                              onChange={(e) =>
                                setRotation(parseFloat(e.target.value))
                              }
                              className="flex-1 accent-black"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="w-8 h-8 mb-4"
                        fill="none"
                        stroke="black"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-lg mb-1 text-black">
                        Tap and upload the image
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <button
            className="bg-white text-black px-8 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            // In the SignaturePopup component, modify the onSave for upload
            onClick={() => {
              if (activeTab === "draw" && signatureRef.current) {
                const data = signatureRef.current.toDataURL();
                onSave(data);
              } else if (activeTab === "upload" && selectedFile) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  onSave(
                    JSON.stringify({
                      imageData: reader.result,
                      zoom: zoom,
                      rotation: rotation,
                    })
                  );
                };
                reader.readAsDataURL(selectedFile);
              } else if (activeTab === "text") {
                onSave(
                  JSON.stringify({
                    text: signatureText,
                    font: selectedFont,
                  })
                );
              }
              onClose();
            }}
          >
            Save
          </button>
          {activeTab === "upload" && previewUrl && (
            <button
              className="bg-[#4B4B4B] text-white px-8 py-2 rounded-lg hover:bg-[#5B5B5B] transition-colors"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
                fileInputRef.current?.click();
              }}
            >
              Upload another
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DocumentSigning: React.FC = () => {

  const [selectedPlaceholder, setSelectedPlaceholder] =
    useState<PlaceholderData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const [signatureData, setSignatureData] = useState<{ [key: number]: string }>(
    {}
  );
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const agreement = location.state?.agreement as Agreement;

  const handleCompleteDocument = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
  
      const formData = new FormData();
      formData.append('documentKey', agreement.documentKey);
      formData.append('senderEmail', userData?.user.email || '');
  
      // Process placeholders
      const processedPlaceholders = [];
  
      for (const placeholder of agreement.placeholders) {
        const signatureValue = signatureData[placeholder.placeholderNumber];
        if (!signatureValue) continue;
  
        if (placeholder.type === 'signature') {
          let imageData = signatureValue;
          
          try {
            const parsedData = JSON.parse(signatureValue);
            if (parsedData.text) {
              // Create canvas for text-based signature
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = 600;
              canvas.height = 200;
              if (ctx) {
                // Make background transparent
                ctx.fillStyle = 'rgba(0, 0, 0, 0)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.font = `48px ${parsedData.font}`;
                ctx.fillStyle = 'black';
                ctx.fillText(parsedData.text, 50, 100);
                imageData = canvas.toDataURL('image/png');
              }
            } else if (parsedData.imageData) {
              // Convert uploaded image to PNG with transparent background
              const img = new Image();
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = parsedData.imageData;
              });
  
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = img.width;
              canvas.height = img.height;
  
              if (ctx) {
                // Make background transparent
                ctx.fillStyle = 'rgba(0, 0, 0, 0)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Apply rotation and zoom
                ctx.translate(canvas.width/2, canvas.height/2);
                ctx.rotate(parsedData.rotation * Math.PI / 180);
                ctx.scale(parsedData.zoom, parsedData.zoom);
                ctx.translate(-canvas.width/2, -canvas.height/2);
                
                ctx.drawImage(img, 0, 0);
                imageData = canvas.toDataURL('image/png');
              }
            }
          } catch (e) {
            // If JSON.parse fails, convert the original signature to PNG
            if (signatureValue.startsWith('data:image')) {
              const img = new Image();
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = signatureValue;
              });
  
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = img.width;
              canvas.height = img.height;
  
              if (ctx) {
                // Make background transparent
                ctx.fillStyle = 'rgba(0, 0, 0, 0)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                imageData = canvas.toDataURL('image/png');
              }
            }
          }
  
          // Convert base64 to blob
          const base64Response = await fetch(imageData);
          const blob = await base64Response.blob();
          const fileName = `signature_${placeholder.placeholderNumber}.png`;
          
          // Append file separately
          formData.append('file', blob, fileName);
  
          processedPlaceholders.push({
            type: 'signature',
            email: placeholder.email,
            file: fileName
          });
        } else if (placeholder.type === 'text') {
          let textValue = signatureValue;
          try {
            const parsedData = JSON.parse(signatureValue);
            textValue = parsedData.text || signatureValue;
          } catch (e) {
            // If JSON.parse fails, use the original value
          }
          
          processedPlaceholders.push({
            type: 'text',
            email: placeholder.email,
            value: textValue
          });
        } else if (placeholder.type === 'date') {
          processedPlaceholders.push({
            type: 'date',
            email: placeholder.email,
            value: signatureValue
          });
        }
      }

      formData.append('placeholders', JSON.stringify(processedPlaceholders));

      const response = await fetch('https://server.signbuddy.in/api/v1/agreedocument', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit signed document');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting signed document:', error);
    }
  };

  useEffect(() => {
    if (userData?.user.email) {
      setCurrentUserEmail(userData.user.email);
    }
  }, [userData]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("https://server.signbuddy.in/api/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        if (data.user) {
          const userWithAvatar = {
            ...data,
            user: {
              ...data.user,
              avatar: data.user.avatar || "/avatars/default.png",
            },
          };
          setUserData(userWithAvatar);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData({
          user: {
            email: "user@example.com",
            userName: "User",
            avatar: "/avatars/default.png",
            credits: 0,
          },
        });
      }
    };

    fetchUserData();
  }, []);

  // Add useEffect for handling clicks outside profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        !profileButtonRef.current?.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Test data
  //   const testDocumentUrls = [
  //     "https://signbuddy.s3.ap-south-1.amazonaws.com/images/1b576efd-4fe8-4aac-853f-05543927d700-Use+cases+-+HydPyHack.pdf/1b576efd-4fe8-4aac-853f-05543927d700-01.jpg",
  //     "https://signbuddy.s3.ap-south-1.amazonaws.com/images/1b576efd-4fe8-4aac-853f-05543927d700-Use+cases+-+HydPyHack.pdf/1b576efd-4fe8-4aac-853f-05543927d700-02.jpg",
  //     "https://signbuddy.s3.ap-south-1.amazonaws.com/images/1b576efd-4fe8-4aac-853f-05543927d700-Use+cases+-+HydPyHack.pdf/1b576efd-4fe8-4aac-853f-05543927d700-03.jpg",
  //     "https://signbuddy.s3.ap-south-1.amazonaws.com/images/1b576efd-4fe8-4aac-853f-05543927d700-Use+cases+-+HydPyHack.pdf/1b576efd-4fe8-4aac-853f-05543927d700-04.jpg",
  //     "https://signbuddy.s3.ap-south-1.amazonaws.com/images/1b576efd-4fe8-4aac-853f-05543927d700-Use+cases+-+HydPyHack.pdf/1b576efd-4fe8-4aac-853f-05543927d700-05.jpg",
  //     "https://signbuddy.s3.ap-south-1.amazonaws.com/images/1b576efd-4fe8-4aac-853f-05543927d700-Use+cases+-+HydPyHack.pdf/1b576efd-4fe8-4aac-853f-05543927d700-06.jpg",
  //     "https://signbuddy.s3.ap-south-1.amazonaws.com/images/1b576efd-4fe8-4aac-853f-05543927d700-Use+cases+-+HydPyHack.pdf/1b576efd-4fe8-4aac-853f-05543927d700-07.jpg", // Replace with your test PDF URL
  //   ];
  const documentUrls = agreement?.documentUrl || [];

  const renderInputField = (placeholder: PlaceholderData) => {
    if (placeholder.email !== currentUserEmail) return null;

    // Convert percentage strings to numbers for calculations
    const width = parseFloat(placeholder.size.width);
    const height = parseFloat(placeholder.size.height);

    const calculateFontSize = (text: string) => {
      const baseSize = Math.min(height * 0.4, width * 0.08);
      const textLength = text?.length || 1;
      const scaleFactor = Math.min(1, 10 / textLength); // Increased text scaling
      return `${baseSize * scaleFactor}vw`;
    };

    const style = {
      position: "absolute" as const,
      left: placeholder.position.x,
      top: placeholder.position.y,
      width: placeholder.size.width,
      height: placeholder.size.height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2px",
    };

    const calculateDateFontSize = (dateText: string) => {
      const baseSize = Math.min(height * 0.4, width * 0.1);
      const textLength = dateText?.length || 1;
      const scaleFactor = Math.min(1, 12 / textLength); // Adjusted scaling for dates
      return `${baseSize * scaleFactor}vw`;
    };

    const signature = signatureData[placeholder.placeholderNumber];

    return (
      <button
        key={placeholder.placeholderNumber}
        style={style}
        className={`${!signature
          ? `border-2 ${placeholder.type === "signature"
            ? "border-blue-500"
            : placeholder.type === "date"
              ? "border-green-500"
              : "border-purple-500"
          } bg-black/80 backdrop-blur-sm`
          : ""
          } rounded hover:border-4 transition-colors flex flex-col items-center justify-center overflow-hidden`}
        onClick={() => setSelectedPlaceholder(placeholder)}
      >
        {signature ? (
          signature.startsWith("data:image") ? (
            <img
              src={signature}
              alt="Signature"
              className="max-w-full max-h-full object-contain"
              style={{ width: "90%", height: "90%" }} // Added size constraints
            />
          ) : signature.startsWith("{") && JSON.parse(signature).imageData ? (
            <div className="w-[90%] h-[90%] relative overflow-hidden">
              {" "}
              {/* Added size constraints */}
              <img
                src={JSON.parse(signature).imageData}
                alt="Signature"
                className="absolute inset-0 m-auto max-w-full max-h-full object-contain"
                style={{
                  transform: `scale(${JSON.parse(signature).zoom}) rotate(${JSON.parse(signature).rotation
                    }deg)`,
                  transformOrigin: "center",
                }}
              />
            </div>
          ) : (
            <span
              className={`w-[95%] text-center text-black ${typeof signature === "string" && signature.startsWith("{")
                ? JSON.parse(signature).font
                : ""
                }`}
              style={{
                fontSize:
                  placeholder.type === "date"
                    ? calculateDateFontSize(signature)
                    : calculateFontSize(
                      typeof signature === "string" &&
                        signature.startsWith("{")
                        ? JSON.parse(signature).text
                        : signature
                    ),
                wordBreak: "break-word",
                lineHeight: "1.2",
              }}
            >
              {typeof signature === "string" && signature.startsWith("{")
                ? JSON.parse(signature).text
                : signature}
            </span>
          )
        ) : (
          <>
            <span
              className="text-white text-xs font-medium"
              style={{ fontSize: `${Math.min(height * 0.3, width * 0.08)}vw` }}
            >
              {placeholder.assignedTo}
            </span>
            <span
              className="text-gray-400 text-[10px] capitalize"
              style={{ fontSize: `${Math.min(height * 0.2, width * 0.06)}vw` }}
            >
              {placeholder.type}
            </span>
          </>
        )}
      </button>
    );
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Store current URL and document state before redirecting
          localStorage.setItem('returnToDocument', window.location.pathname);
          if (location.state?.agreement) {
            localStorage.setItem('documentState', JSON.stringify(location.state.agreement));
          }
          throw new Error("No token found");
        }

        const response = await fetch("https://server.signbuddy.in/api/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Invalid token");
        }

        setIsAuthenticated(true);
        setIsLoading(false);

        // Check for saved document state only if there's no current agreement
        if (!location.state?.agreement) {
          const savedDocumentState = localStorage.getItem('documentState');
          if (savedDocumentState) {
            try {
              const agreement = JSON.parse(savedDocumentState);
              // Clean up stored state
              localStorage.removeItem('documentState');
              localStorage.removeItem('returnToDocument');
              // Use replace to avoid adding to history stack
              navigate(window.location.pathname, { 
                state: { agreement },
                replace: true 
              });
              return; // Exit early after navigation
            } catch (e) {
              console.error('Error parsing saved document state:', e);
            }
          }
          // Only navigate to dashboard if no saved state and no current agreement
          navigate('/dashboard', { 
            state: { error: "No document found to sign" },
            replace: true
          });
        }
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/login", { 
          state: { 
            returnUrl: localStorage.getItem('returnToDocument') || window.location.pathname,
            message: "Please login to access document signing" 
          },
          replace: true
        });
      }
    };

    checkAuth();
  }, [navigate, location.state?.agreement]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !location.state?.agreement) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Add Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="py-5">
          <div className="max-w-[1440px] mx-auto px-4 md:px-12 flex items-center justify-between">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white border border-gray-600 rounded-lg px-3 py-1.5 md:px-4 md:py-2 hover:border-white transition-colors text-sm md:text-base"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Home
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={handleCompleteDocument}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
              >
                Completed
              </button>
              <div className="relative">
                <button
                  ref={profileButtonRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen(!isProfileOpen);
                  }}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-black/40"
                >
                  <img
                    src={userData?.user.avatar}
                    alt={userData?.user.userName}
                    className="w-9 h-9 rounded-full object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = "/avatars/default.png";
                    }}
                  />
                </button>

                {isProfileOpen && (
                  <div
                    ref={profileMenuRef}
                    className="absolute right-0 mt-2 w-56 bg-black rounded-lg shadow-lg py-1 border border-white/30 z-[100]"
                  >
                    <div className="px-4 py-2">
                      <div className="text-sm font-bold text-white">
                        {userData?.user.userName}
                      </div>
                      <div className="text-xs font-bold text-gray-400">
                        {userData?.user.email}
                      </div>
                      <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-[#212121] rounded-md mx-[-5px]">
                        <img
                          src={creditsIcon}
                          alt="Credits"
                          className="w-4 h-4"
                        />
                        <div className="text-sm font-semibold">
                          <span className="text-white">
                            {userData?.user.credits}
                          </span>
                          <span className="text-gray-400"> credits</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-1">
                      <hr className="border-white/20" />
                    </div>
                    <Link
                      to="/account-settings"
                      className="block px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white hover:bg-black/60"
                    >
                      Account Settings
                    </Link>
                    <Link
                      to="/billing"
                      className="block px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white hover:bg-black/60"
                    >
                      Billing
                    </Link>
                    <Link
                      to="/logout"
                      className="block px-4 py-2 text-sm font-semibold text-red-500 hover:bg-black/60"
                    >
                      Log out
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-[85px] ">
        <div className="max-w-5xl mx-auto px-8">
          {documentUrls.map((pageUrl, pageIndex) => (
            <div
              key={pageIndex}
              className="relative mb-8 bg-white rounded-lg shadow-lg"
            >
              <img
                src={pageUrl}
                alt={`Document page ${pageIndex + 1}`}
                className="w-full h-auto"
              />
              {agreement?.placeholders
                .filter((p) => p.pageNumber === pageIndex + 1)
                .map((placeholder) => renderInputField(placeholder))}
            </div>
          ))}
        </div>
      </div>

      <SignaturePopup
        isOpen={selectedPlaceholder !== null}
        onClose={() => setSelectedPlaceholder(null)}
        onSave={(data) => {
          if (selectedPlaceholder) {
            setSignatureData((prev) => ({
              ...prev,
              [selectedPlaceholder.placeholderNumber]: data,
            }));
          }
          setSelectedPlaceholder(null);
        }}
        type={selectedPlaceholder?.type || "signature"}
      />
    </div>
  );
};

export default DocumentSigning;
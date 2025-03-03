import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import creditsIcon from "../../assets/images/credits-icon.png";
import Toast from "./Toast";
import { DocumentViewer } from "./DocumentViewer"; // Import the DocumentViewer component

interface Placeholder {
  id: number;
  pageIndex: number;
  xPercent: number; // Store as percentage of image width
  yPercent: number; // Store as percentage of image height
  widthPercent: number; // Store as percentage of image width
  heightPercent: number; // Store as percentage of image height
  fieldType?: "name" | "date" | "signature" | "text";
  signer?: string;
  editingStep?: "fieldType" | "signer";
}

// Add interface at the top with other interfaces
interface UserData {
  user: {
    email: string;
    userName: string;
    avatar: string;
    credits: number;
  };
}
interface LocationState {
  imageUrls: string[];
  originalName: string;
}

const DocumentRecipients: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { imageUrls = [], originalName } =
    (location.state as LocationState) || {};
  // Group all state declarations together at the top
  const [showToast, setShowToast] = useState(false);
  const [isSignatory, setIsSignatory] = useState(false);
  const [recipients, setRecipients] = useState([{ name: "", email: "" }]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasProceeded, setHasProceeded] = useState(false);
  const [selectedPlaceholderType, setSelectedPlaceholderType] = useState<
    "signature" | "date" | "text" | null
  >(null); // Start with null
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null); // Track mouse position
  const [containerDimensions, setContainerDimensions] =
    useState<DOMRect | null>(null);
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([]);
  const [placeholderIdCounter, setPlaceholderIdCounter] = useState(0);
  const [documentName, setDocumentName] = useState<string>(""); // State for document name
  const [toastMessage, setToastMessage] = useState<string>(""); // State for toast message
  const [toastDuration, setToastDuration] = useState<number>(5000); // State for toast duration
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isProceedValidated, setIsProceedValidated] = useState(false);
  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  const [showPlacementHint, setShowPlacementHint] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const users = ["User1", "User2", "User3"]; //
  const toggleFab = () => {
    setIsFabOpen(!isFabOpen);
  };
  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      // You can either redirect to another page
      navigate("/dashboard");
      // Or show an error message
      setToastMessage("No document images found");
      setShowToast(true);
    }
    setDocumentPages(imageUrls);
  }, [imageUrls, navigate]);
  const getAvailableSigners = () => {
    const validRecipients = recipients.filter(
      (recipient) =>
        recipient.name.trim() !== "" && recipient.email.trim() !== ""
    );
    const signers = [...validRecipients.map((r) => r.name)];
    if (isSignatory) signers.push("You");
    return signers;
  };

  const [previewPlaceholder, setPreviewPlaceholder] = useState<{
    type: "signature" | "date" | "text";
    signer: string;
    x: number;
    y: number;
  } | null>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!previewRef.current) return;

    const documentContainer = previewRef.current.querySelector(
      ".document-preview-container"
    );
    if (!documentContainer) return;

    const rect = documentContainer.getBoundingClientRect();
    const scrollLeft = documentContainer.scrollLeft || 0;
    const scrollTop = documentContainer.scrollTop || 0;

    const x = e.clientX - rect.left + scrollLeft;
    const y = e.clientY - rect.top + scrollTop;

    setMousePosition({ x, y });
  };

  const [isPersonSelectModalOpen, setIsPersonSelectModalOpen] = useState(false);

  // Function to open the person selection modal
  const openPersonSelectModal = () => {
    setIsPersonSelectModalOpen(true);
  };

  // Function to close the person selection modal
  const closePersonSelectModal = () => {
    setIsPersonSelectModalOpen(false);
  };

  // Function to handle person selection from the modal
  const handlePersonSelect = (person: string) => {
    setSelectedUser(person);
    closePersonSelectModal();
    setIsFabOpen(true); // Show the placeholder options after person selection
  };

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
          // Update default avatar if none provided
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
        // Set fallback user data with default avatar
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

  useEffect(() => {
    // Simulate fetching the document name from an API or other source
    const fetchDocumentName = async () => {
      // Replace this with actual API call or logic to get the document name
      const fetchedName = originalName; // Example name
      setDocumentName(fetchedName);
    };

    fetchDocumentName();
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (previewRef.current) {
        setContainerDimensions(previewRef.current.getBoundingClientRect());
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions(); // Initial measurement

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Group all refs together
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [documentPages, setDocumentPages] = useState<string[]>([]);

  const handleImageClick = (
    pageIndex: number,
    e: React.MouseEvent<HTMLImageElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    const newPlaceholder: Placeholder = {
      id: placeholderIdCounter,
      pageIndex,
      xPercent,
      yPercent,
      widthPercent: (80 / rect.width) * 100,
      heightPercent: (40 / rect.height) * 100,
      editingStep: "fieldType",
    };

    setPlaceholderIdCounter((prev) => prev + 1);
    setPlaceholders((prev) => [...prev, newPlaceholder]);
  };

  const updatePlaceholderById = (id: number, updates: Partial<Placeholder>) => {
    setPlaceholders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePlaceholder = (id: number) => {
    setPlaceholders((prev) => prev.filter((p) => p.id !== id));
  };

  const handleFabClick = () => {
    const availableSigners = getAvailableSigners();
    if (availableSigners.length === 1) {
      // Auto-select the only available signer
      setSelectedUser(availableSigners[0]);
      setIsFabOpen(!isFabOpen);
    } else if (isMobileDevice()) {
      openPersonSelectModal();
    }
    setIsFabOpen(!isFabOpen);
  };

  const handlePlaceholderDrop = (
    pageIndex: number,
    xPercent: number,
    yPercent: number,
    type: string
  ) => {
    if (!selectedUser) return;

    const newPlaceholder: Placeholder = {
      id: placeholderIdCounter,
      pageIndex,
      xPercent,
      yPercent,
      widthPercent: 15, // Approximately 120px on an 800px wide image
      heightPercent: 6.25, // Approximately 50px on an 800px high image
      fieldType: type as "signature" | "date" | "text",
      signer: selectedUser,
    };

    setPlaceholderIdCounter((prev) => prev + 1);
    setPlaceholders((prev) => [...prev, newPlaceholder]);
    setSelectedPlaceholderType(null);
    setSelectedUser(null);
  };

  const handlePlaceholderSelect = (type: "text" | "signature" | "date") => {
    setSelectedPlaceholderType(type);
    setIsFabOpen(false);
    setShowPlacementHint(true);
    // Hide the hint after 2 seconds
    setTimeout(() => setShowPlacementHint(false), 2000);
  };

  const handlePdfRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const availableSigners = getAvailableSigners();

    if (availableSigners.length === 1) {
      // Auto-select the only available signer
      setSelectedUser(availableSigners[0]);
    }

    const rect = previewRef.current?.getBoundingClientRect();
    if (rect) {
      const x =
        event.clientX - rect.left + (previewRef.current?.scrollLeft || 0);
      const y = event.clientY - rect.top + (previewRef.current?.scrollTop || 0);

      setContextMenu({
        x: event.clientX - 10,
        y: event.clientY - 10,
      });
      setMousePosition({ x, y });
    }
  };

  useEffect(() => {
    const handleClickOrScroll = (event: Event) => {
      // Change MouseEvent to Event
      if (contextMenu) {
        const menuElement = document.querySelector(".context-menu-class");
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setContextMenu(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOrScroll);

    const previewElement = previewRef.current;
    if (previewElement) {
      previewElement.addEventListener("scroll", handleClickOrScroll); // This now works with Event
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOrScroll);
      if (previewElement) {
        previewElement.removeEventListener("scroll", handleClickOrScroll); // This now works with Event
      }
    };
  }, [contextMenu]);

  const isValidEmail = (email: string): boolean => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) !== null;
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [previewPosition]);

  const handleContextMenuSelect = (type: "signature" | "date" | "text") => {
    if (!selectedUser) {
      setToastMessage(
        "Please select a person before choosing a placeholder type."
      );
      setToastDuration(5000);
      setShowToast(true);
      return;
    }

    setPreviewPlaceholder({
      type,
      signer: selectedUser,
      x: mousePosition?.x || 0,
      y: mousePosition?.y || 0,
    });
    setContextMenu(null);
  };

  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (previewPlaceholder) {
      const imageElements = Array.from(e.currentTarget.querySelectorAll("img"));
      if (!imageElements.length) return;

      let clickedImage: HTMLImageElement | null = null;
      let pageIndex = 0;

      for (let i = 0; i < imageElements.length; i++) {
        const img = imageElements[i];
        const rect = img.getBoundingClientRect();
        if (
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom &&
          e.clientX >= rect.left &&
          e.clientX <= rect.right
        ) {
          clickedImage = img;
          pageIndex = i;
          break;
        }
      }

      if (!clickedImage) return;

      const rect = clickedImage.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

      const newPlaceholder: Placeholder = {
        id: placeholderIdCounter,
        pageIndex,
        xPercent,
        yPercent,
        widthPercent: 15,
        heightPercent: 6.25,
        fieldType: previewPlaceholder.type,
        signer: previewPlaceholder.signer,
        editingStep: "fieldType",
      };

      setPlaceholderIdCounter((prev) => prev + 1);
      setPlaceholders((prev) => [...prev, newPlaceholder]);
      setPreviewPlaceholder(null);
      setSelectedUser(null);
    }
  };

  const areAllFieldsValid = (
    recipients: { name: string; email: string }[]
  ): boolean => {
    // Check if at least one recipient has both a valid name and email
    return recipients.some((recipient) => {
      return (
        recipient.name.trim() !== "" &&
        recipient.email.trim() !== "" &&
        isValidEmail(recipient.email.trim())
      );
    });
  };

  // Move isBlurActive declaration here, after areAllFieldsValid is defined
  const isBlurActive = !hasProceeded;

  const handleProceed = (): void => {
    if (!isSignatory && !areAllFieldsValid(recipients)) {
      setToastMessage(
        "Please ensure the required details are filled before proceeding."
      );
      setToastDuration(5000); // Set duration for this specific toast
      setShowToast(true);
      return;
    }
    setHasProceeded(true);
    setIsProceedValidated(true); // Set validation state to true
    previewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addRecipient = (): void => {
    setRecipients([...recipients, { name: "", email: "" }]);
  };

  const deleteRecipient = (index: number): void => {
    const newRecipients = recipients.filter((_, i) => i !== index);
    setRecipients(newRecipients);
  };

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUserSelect = (user: string) => {
    setSelectedUser(user);
  };

  const handleFieldSelect = (type: "signature" | "date" | "text") => {
    if (selectedUser) {
      console.log("User:", selectedUser, "Field Type:", type);
      // Logic to assign the selected user and field type to a placeholder
      // Example: updatePlaceholderById(selectedPlaceholderId, { signer: selectedUser, fieldType: type });
      setContextMenu(null); // Close the context menu after selection
      setSelectedUser(null); // Reset selected user
    }
  };

  const handleEmailing = async () => {
    try {
      // Get recipient emails and names
      const emails: string[] = [];
      const names: string[] = [];

      recipients.forEach((recipient) => {
        if (recipient.name.trim() && recipient.email.trim()) {
          names.push(recipient.name.trim());
          emails.push(recipient.email.trim());
        }
      });

      // Add current user if they are a signatory
      if (isSignatory && userData?.user.email) {
        names.push("You");
        emails.push(userData.user.email);
      }

      // Format placeholders data
      const placeholderData = placeholders.map((placeholder, index) => ({
        placeholderNumber: index + 1,
        position: {
          x: placeholder.xPercent.toFixed(2) + "%",
          y: placeholder.yPercent.toFixed(2) + "%",
        },
        type: placeholder.fieldType,
        size: {
          width: placeholder.widthPercent.toFixed(2) + "%",
          height: placeholder.heightPercent.toFixed(2) + "%",
        },
        assignedTo: placeholder.signer,
        email:
          placeholder.signer === "You"
            ? userData?.user.email
            : recipients.find((r) => r.name === placeholder.signer)?.email ||
              "",
        pageNumber: placeholder.pageIndex + 1,
      }));

      const payload = {
        emails,
        names,
        placeholders: placeholderData,
        fileKey: location.state?.fileKey || "", // Make sure fileKey is passed in navigation state
      };

      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://server.signbuddy.in/api/v1/sendagreement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send agreement");
      }

      // Show success toast and navigate to dashboard
      setToastMessage("Agreement sent successfully!");
      setShowToast(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error sending agreement:", error);
      setToastMessage("Failed to send agreement. Please try again.");
      setShowToast(true);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 relative">
          {/* Header */}
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
                      src={userData?.user.avatar || "/avatars/default.png"}
                      alt={userData?.user.userName || "Profile"}
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

          {/* Main Layout */}
          <div className="flex flex-col md:flex-row md:gap-36 mt-[60px] md:mt-[70px]">
            {/* Left Section - Progress Steps */}
            <div className="hidden md:flex fixed top-1/2 -translate-y-1/2 flex-col gap-24 min-w-[300px] ml-4">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[#DADADB] bg-opacity-10 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#DADADB] bg-opacity-20 flex items-center justify-center">
                      <div className="w-4 h-4 text-xs rounded-full border-2 border-white flex items-center justify-center text-white">
                        ✓
                      </div>
                    </div>
                  </div>
                  <div className="absolute h-28 w-0 border-l border-dashed border-[#DADADB] border-opacity-20 top-14 left-1/2 transform -translate-x-1/2" />
                </div>
                <div className="flex flex-col pt-2">
                  <span className="text-lg font-medium">
                    Creating the document
                  </span>
                  <span className="text-sm text-gray-500 max-w-[280px]">
                    Your document has been created and saved as draft.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[#DADADB] bg-opacity-10 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#DADADB] bg-opacity-20 flex items-center justify-center">
                      <div className="w-4 h-4 text-xs rounded-full border-2 border-white flex items-center justify-center text-white">
                        {hasProceeded &&
                        (isSignatory || areAllFieldsValid(recipients))
                          ? "✓"
                          : ""}
                      </div>
                    </div>
                  </div>
                  <div className="absolute h-28 w-0 border-l border-dashed border-[#DADADB] border-opacity-20 top-14 left-1/2 transform -translate-x-1/2" />
                </div>
                <div className="flex flex-col pt-2">
                  <span className="text-lg font-medium">
                    Entering the mails
                  </span>
                  <span className="text-sm text-gray-500 max-w-[280px]">
                    Enter the emails to send the document to people who needs to
                    sign.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[#DADADB] bg-opacity-10 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#DADADB] bg-opacity-20 flex items-center justify-center">
                      <div className="w-4 h-4 text-xs rounded-full border-2 border-white flex items-center justify-center text-white">
                        {placeholders.length > 0 ? "✓" : ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col pt-2">
                  <span className="text-lg font-medium">
                    Selecting the placeholders
                  </span>
                  <span className="text-sm text-gray-500 max-w-[280px] text-[#7A7A81]">
                    Select the placeholders where the people could enter the
                    data.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Main Content */}
            <div className="flex-1 bg-black md:bg-[#111111] md:rounded-lg p-4 md:p-12 md:ml-[400px] mt-0 md:mt-[70px] mx-[-16px] md:mx-0">
              {/* New Scrollable Container */}
              <div className="overflow-y-auto max-h-[80vh]">
                {/* Main Content */}
                <div className="mb-8 text-center flex flex-col items-center">
                  <h2 className="text-xl md:text-2xl font-semibold mb-2">
                    Please enter the details below
                  </h2>
                  <p className="text-gray-400 text-sm md:text-base max-w-[500px] mx-auto px-4 md:px-0">
                    These people will be completing the document by entering the
                    details like Date, Name and signing it.
                  </p>
                </div>

                {/* Form */}
                <div className="max-w-3xl space-y-6 relative px-4 md:px-0">
                  <div className="flex items-center gap-2 mb-6">
                    <input
                      type="checkbox"
                      checked={isSignatory}
                      onChange={(e) => setIsSignatory(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-400"
                    />
                    <span className="text-gray-400">
                      I will also be signing the document
                    </span>
                  </div>

                  <div className="space-y-6 relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-x-16">
                      {recipients.map((recipient, index) => (
                        <div key={index} className="relative">
                          <div className="space-y-6 pr-10">
                            <div>
                              <label className="block text-sm mb-2">
                                Enter the name
                              </label>
                              <input
                                type="text"
                                value={recipient.name}
                                onChange={(e) => {
                                  const newRecipients = [...recipients];
                                  newRecipients[index].name = e.target.value;
                                  setRecipients(newRecipients);
                                }}
                                className="w-full bg-transparent border border-gray-600 rounded px-4 py-2.5 focus:outline-none focus:border-white"
                                placeholder="John Doe"
                              />
                            </div>

                            <div>
                              <label className="block text-sm mb-2">
                                Enter the mail
                              </label>
                              <input
                                type="email"
                                value={recipient.email}
                                onChange={(e) => {
                                  const newRecipients = [...recipients];
                                  newRecipients[index].email = e.target.value;
                                  setRecipients(newRecipients);
                                }}
                                className="w-full bg-transparent border border-gray-600 rounded px-4 py-2.5 focus:outline-none focus:border-white"
                                placeholder="john@google.com"
                              />
                            </div>
                          </div>
                          {recipients.length > 1 && (
                            <button
                              onClick={() => deleteRecipient(index)}
                              className="absolute right-0 top-0 p-1.5 text-gray-400 hover:text-red-500 border border-gray-600 rounded-full hover:border-red-500"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center mt-8">
                      <button
                        onClick={addRecipient}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded text-sm text-gray-400 hover:text-white hover:border-white transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add a person
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleProceed}
                    className="px-4 py-2 bg-white text-black rounded hover:bg-gray-100 transition-colors"
                  >
                    Proceed →
                  </button>
                </div>
                {/* Credits Info */}
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                  <svg
                    className="w-4 h-4"
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
                  Each person would cost you 10 Credits
                </div>
                {/* Context Menu */}
                {contextMenu && (
                  <div
                    className="fixed bg-[#111111] text-white rounded shadow-lg z-[1100] border border-gray-600 context-menu-class"
                    style={{
                      top: `${contextMenu.y}px`,
                      left: `${contextMenu.x}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Person Selection */}
                    <div className="px-4 py-2 border-b border-gray-600">
                      <div className="text-sm font-bold">
                        {selectedUser || "Select a Person"}
                      </div>
                      <div className="mt-2">
                        {recipients
                          .filter(
                            (recipient) =>
                              recipient.name.trim() !== "" &&
                              recipient.email.trim() !== ""
                          )
                          .map((recipient, index) => (
                            <div
                              key={index}
                              className="hover:bg-gray-700 px-2 py-1 cursor-pointer"
                              onClick={() => setSelectedUser(recipient.name)}
                            >
                              {recipient.name}
                            </div>
                          ))}
                        {isSignatory && (
                          <div
                            className="hover:bg-gray-700 px-2 py-1 cursor-pointer"
                            onClick={() => setSelectedUser("You")}
                          >
                            You
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Placeholder Type Selection */}
                    <button
                      onClick={() => handleContextMenuSelect("text")}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 w-full"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16m-7 6h7"
                        />
                      </svg>
                      Text
                    </button>
                    <button
                      onClick={() => handleContextMenuSelect("signature")}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 w-full"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Signature
                    </button>
                    <button
                      onClick={() => handleContextMenuSelect("date")}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 w-full"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10m-5 4h5m-5 4h5m-5-8h5m-5-4h5"
                        />
                      </svg>
                      Date
                    </button>
                  </div>
                )}

                {/* Floating Action Button for Mobile */}
                {showPlacementHint && (
                  <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-lg text-sm border border-white/20 z-50 whitespace-nowrap">
                    Tap anywhere on the document to place
                  </div>
                )}
                {!isBlurActive && (
                  <div className="fixed bottom-4 right-4 z-50 md:hidden">
                    <button
                      onClick={handleFabClick}
                      className={`relative w-14 h-14 rounded-full bg-black text-white flex items-center justify-center border-4 border-white/40 transition-transform transform ${
                        isFabOpen ? "rotate-45" : ""
                      }`}
                    >
                      {isFabOpen ? (
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      )}
                    </button>
                    {isFabOpen && selectedUser && (
                      <div className="flex flex-col items-center space-y-3 absolute bottom-16">
                        <button
                          onClick={() => {
                            handlePlaceholderSelect("text");
                            setIsFabOpen(false);
                          }}
                          className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 12h16m-7 6h7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            handlePlaceholderSelect("signature");
                            setIsFabOpen(false);
                          }}
                          className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            handlePlaceholderSelect("date");
                            setIsFabOpen(false);
                          }}
                          className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10m-5 4h5m-5 4h5m-5-8h5m-5-4h5"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {isPersonSelectModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1100]">
                    <div className="bg-[#111111] rounded-lg p-4 w-80 border border-gray-600">
                      <h2 className="text-lg font-bold mb-4 text-white">
                        Select a Person
                      </h2>
                      <div className="space-y-2">
                        {recipients
                          .filter(
                            (recipient) =>
                              recipient.name.trim() !== "" &&
                              recipient.email.trim() !== ""
                          )
                          .map((recipient, index) => (
                            <div
                              key={index}
                              className="hover:bg-gray-700 px-2 py-1 cursor-pointer text-gray-200"
                              onClick={() => handlePersonSelect(recipient.name)}
                            >
                              {recipient.name}
                            </div>
                          ))}
                        {isSignatory && (
                          <div
                            className="hover:bg-gray-700 px-2 py-1 cursor-pointer text-gray-200"
                            onClick={() => handlePersonSelect("You")}
                          >
                            You
                          </div>
                        )}
                      </div>
                      <button
                        onClick={closePersonSelectModal}
                        className="mt-4 w-full bg-gray-700 text-white rounded py-2 hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Document Preview */}
                <div className="mt-5 relative" ref={previewRef}>
                  {/* Document Header */}
                  <div className="border border-gray-600 rounded-lg p-4 mb-4 bg-[#0A0A0A]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm md:text-base">
                          {documentName}
                        </span>
                      </div>
                      <button
                        onClick={handleEmailing}
                        className="px-3 py-1 md:px-4 md:py-1.5 bg-white text-black rounded text-xs md:text-sm"
                      >
                        Emailing →
                      </button>
                    </div>
                  </div>
                  {/* Desktop-only instruction */}
                  <div className="mt-4 mb-4 hidden md:flex items-center gap-2 text-sm text-gray-400">
                    <svg
                      className="w-4 h-4"
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
                    Right click on the document to add placeholders
                  </div>
                  {/* Document Preview Section */}
                  <div
                    className="border border-gray-600 rounded-lg overflow-hidden bg-[#0A0A0A] p-4 relative document-preview-container"
                    onContextMenu={handlePdfRightClick}
                    onClick={handlePreviewClick}
                    ref={previewRef}
                    style={{
                      minHeight: "750px",
                      position: "relative",
                      overflow: "auto",
                      cursor: previewPlaceholder ? "cursor" : "default",
                    }}
                  >
                    <DocumentViewer
                      docPages={documentPages}
                      isDisabled={isBlurActive}
                      placeholders={placeholders}
                      onImageClick={handleImageClick}
                      onUpdatePlaceholder={updatePlaceholderById}
                      onDeletePlaceholder={deletePlaceholder}
                      users={users}
                      onPlaceholderDrop={handlePlaceholderDrop}
                      selectedPlaceholderType={selectedPlaceholderType}
                    />

                    {/* Preview Placeholder */}
                    {previewPlaceholder && mousePosition && (
                      <div
                        style={{
                          position: "absolute",
                          left: `${mousePosition.x - 60}px`, // Center horizontally (120/2 = 60)
                          top: `${mousePosition.y - 25}px`, // Center vertically (50/2 = 25)
                          width: "120px",
                          height: "50px",
                          backgroundColor: "rgba(0, 0, 0, 0.85)",
                          border: "2px solid white",
                          borderRadius: "4px",
                          pointerEvents: "none",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "white",
                          fontSize: "12px",
                          padding: "6px",
                          zIndex: 1000,
                          transform: "translate(0, 0)",
                        }}
                      >
                        <div className="font-bold truncate w-full text-center mb-1">
                          {previewPlaceholder.signer}
                        </div>
                        <div className="text-gray-300 text-[11px]">
                          {previewPlaceholder.type}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
          duration={toastDuration}
        />
      )}
    </>
  );
};

export default DocumentRecipients;
import React, { useState, useRef, useEffect } from "react";
import plusIcon from "../../assets/images/Vector.png";
import pendingIcon from "../../assets/images/pending.png";
import completedIcon from "../../assets/images/security-icon.png";
import templateIcon from "../../assets/images/upload-doc.png";
import documentIcon from "../../assets/images/manage-icon.png";
import { useNavigate } from "react-router-dom";

interface RecentDocument {
  documentKey: string;
  title: string;
  documentUrl: string[];
  status: string;
  recipients: {
    email: string;
    name: string;
    recipientsAvatar?: string;
    role?: string;
    message?: string;
    subject?: string;
  }[];
  signedDocument: string | null;
  placeholders: {
    position: { x: string; y: string };
    size: { width: string; height: string };
    placeholderNumber: number;
    type: string;
    assignedTo: string;
    email: string;
    pageNumber: number;
  }[];
  drafts: any[];
  type?: 'agreement' | 'draft';
  emailData?: {
    subject: string;
    message: string;
    ccEmails?: string[];
    bccEmails?: string[];
  };
}
interface PreviewDocument {
  title: string;
  pages: string[];
  placeholders: {
    position: { x: string; y: string };
    size: { width: string; height: string };
    type: string;
    value?: string;
    assignedTo: string;
    pageNumber: number;
  }[];
}

interface IncomingAgreement {
  agreementKey: string;
  senderEmail: string;
  imageUrls: string[];
  title: string;
  placeholders: {
    placeholderNumber: number;
    position: { x: string; y: string };
    type: string;
    size: { width: string; height: string };
    assignedTo: string;
    email: string;
    pageNumber: number;
  }[];
  receivedAt: string;
  status: string;
}

interface UserData {
  success: boolean;
  user: {
    _id: string;
    email: string;
    userName: string;
    avatar: string;
    credits: number;
    // ... other user fields
  };
  templatesCount: number;
  totalDocuments: number;
  completedDocuments: number;
  pendingDocuments: number;
}

type DocumentStatus = "draft" | "viewed" | "completed" | "pending" | "all";

const Dashboard: React.FC = () => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<DocumentStatus[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PreviewDocument | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [recentDocuments, setRecentDocuments] = useState<RecentDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [documentKeyToDelete, setDocumentKeyToDelete] = useState<string | null>(
    null
  );
  const [receivedDocuments, setReceivedDocuments] = useState<RecentDocument[]>(
    []
  );
  const [documentTypeToDelete, setDocumentTypeToDelete] = useState<'agreement' | 'draft' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
const documentsPerPage = 10; 
  // Add this with other state declarations
  const [activeTab, setActiveTab] = useState<"your" | "received">(() => {
    const savedTab = localStorage.getItem("dashboardActiveTab");
    return savedTab === "your" || savedTab === "received" ? savedTab : "your";
  });

  useEffect(() => {
    localStorage.setItem("dashboardActiveTab", activeTab);
  }, [activeTab]);

  const getPaginatedDocuments = (documents: RecentDocument[]) => {
    const indexOfLastDoc = currentPage * documentsPerPage;
    const indexOfFirstDoc = indexOfLastDoc - documentsPerPage;
    return documents.slice(indexOfFirstDoc, indexOfLastDoc);
  };

  const filteredDocuments = recentDocuments.filter((doc) => {
    const matchesStatus =
      statusFilter.length === 0
        ? true
        : statusFilter.includes(doc.status.toLowerCase() as DocumentStatus);
    const matchesSearch =
      searchQuery === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredReceivedDocuments = receivedDocuments.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const paginatedDocuments = getPaginatedDocuments(
    activeTab === "your" ? filteredDocuments : filteredReceivedDocuments
  );

  const PaginationControls = ({ totalDocuments }: { totalDocuments: number }) => {
    const totalPages = Math.ceil(totalDocuments / documentsPerPage);
  

  };

  const truncateText = (text: string | undefined, maxLength: number = 30) => {
    if (!text) return ""; // Return empty string if text is undefined or null
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const handleCompleteDraft = (doc: RecentDocument) => {
    try {
      // Navigate with all the existing draft data
      navigate(`/document/recipients`, {  // Remove the query parameter
        state: {
          documentKey: doc.documentKey,
          documentUrls: doc.documentUrl,
          documentTitle: doc.title,
          placeholders: doc.placeholders,
          emailData: doc.emailData || {},
          recipients: doc.recipients.map(r => ({
            email: r.email,
            name: r.name,
            role: r.role || 'signer',
            message: r.message,
            subject: r.subject
          }))
        },
      });
    } catch (error) {
      console.error('Error handling draft:', error);
    }
  };

  const getRecipientUpdateText = (doc: RecentDocument) => {
    if (activeTab === "received") {
      return `Document received ${doc.receivedAt || "recently"}`;
    }

    if (!doc.recipients || doc.recipients.length === 0) {
      return "No recipients added";
    }

    const recipient = doc.recipients[0];
    if (!recipient) {
      return "No recipient information";
    }

    return `${recipient.name || "Unknown"} ${doc.status === "completed"
      ? "has signed"
      : doc.status === "viewed"
        ? "has viewed"
        : doc.status === "pending"
          ? "needs to sign"
          : "has drafted"
      } the document`;
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch(
          "https://server.signbuddy.in/api/v1/me/recentdocuments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        // Update recent documents
        if (data.recentDocuments) {
          setRecentDocuments(data.recentDocuments);
        }

        // Update received documents (incoming agreements)
        if (data.incomingAgreements) {
          // Transform incoming agreements to match the RecentDocument structure
          const transformedAgreements = data.incomingAgreements.map(
            (agreement: IncomingAgreement) => ({
              documentKey: agreement.agreementKey,
              title: agreement.title,
              documentUrl: agreement.imageUrls,
              status: agreement.status,
              recipients: [
                { email: agreement.senderEmail, name: agreement.senderEmail },
              ],
              signedDocument: null,
              placeholders: agreement.placeholders,
              drafts: [],
              receivedAt: agreement.receivedAt,
            })
          );
          setReceivedDocuments(transformedAgreements);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch("https://server.signbuddy.in/api/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setUserData(data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showStatusFilter &&
        !(event.target as Element).closest(".status-filter")
      ) {
        setShowStatusFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showStatusFilter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setActiveTooltip(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteDocument = (title: string, documentKey: string, type: 'agreement' | 'draft') => {
    setDocumentToDelete(title);
    setDocumentKeyToDelete(documentKey); // Add this state
    setDocumentTypeToDelete(type);
    setShowDeleteConfirm(true);
  };

  const handleNewDocument = () => {
    navigate("/document");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, activeTab]);

  const handleSendReminder = async (doc: RecentDocument) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const reminderData = {
        emails: doc.recipients.map((recipient) => recipient.email),
        names: doc.recipients.map((recipient) => recipient.name),
        previewImageUrl: doc.documentUrl[0] || "",
        redirectUrl: `${window.location.origin}/sign/${doc.documentKey}`,
      };

      const response = await fetch(
        "https://server.signbuddy.in/api/v1/sendreminder",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reminderData),
        }
      );

      if (response.ok) {
        alert("Reminders sent successfully");
      } else {
        throw new Error("Failed to send reminders");
      }
    } catch (error) {
      console.error("Error sending reminders:", error);
      alert("Failed to send reminders");
    }
  };

  const handlePreviewDocument = (doc: RecentDocument) => {
    if (!doc.documentUrl || doc.documentUrl.length === 0) {
      console.log("No preview available for this document");
      return;
    }

    // Transform the placeholders from RecentDocument format to PreviewDocument format
    const formattedPlaceholders = doc.placeholders.map(p => ({
      position: {
        x: p.position.x,
        y: p.position.y
      },
      size: {
        width: p.size.width,
        height: p.size.height
      },
      type: p.type,
      assignedTo: p.assignedTo,
      pageNumber: p.pageNumber,
      value: ''
    }));

    setSelectedDocument({
      title: doc.title,
      pages: doc.documentUrl,
      placeholders: formattedPlaceholders
    });
    setShowPreview(true);
  };

  const handleStatusFilter = (status: DocumentStatus) => {
    if (status.toLowerCase() === "all") {
      setStatusFilter([]);
    } else {
      setStatusFilter((prev) => {
        const normalizedStatus = status.toLowerCase() as DocumentStatus;
        const isAlreadySelected = prev.includes(normalizedStatus);
        if (isAlreadySelected) {
          return prev.filter((s) => s !== normalizedStatus);
        } else {
          return [...prev, normalizedStatus];
        }
      });
    }
  };

  const NoDocumentsMessage = ({ type }: { type: "your" | "received" }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="w-16 h-16 text-gray-400 mb-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className="text-xl font-medium text-gray-300 mb-2">
        {type === "your" ? "No Documents Yet" : "No Received Documents"}
      </h3>
      <p className="text-gray-400 max-w-sm">
        {type === "your"
          ? 'Get started by creating your first document using the "New Document" button above.'
          : "You haven't received any documents for signing yet."}
      </p>
    </div>
  );

  return (
    <div className="bg-black">
      <div className="max-w-7xl mx-auto px-4 py-2">
        {/* Header Section */}
        <div className="mb-4 flex flex-col-reverse sm:flex-row sm:justify-between">
          <div className="mt-4 sm:mt-0">
            <h1 className="text-[28px] leading-tight font-bold mb-2 sm:text-3xl sm:mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400 text-[15px] leading-tight">
              Manage all your documents at one place at your fingertips
            </p>
          </div>
          <button
            onClick={handleNewDocument}
            className="w-[160px] h-[36px] sm:h-auto self-end sm:w-auto flex items-center justify-center gap-2 bg-[#E6E6E6] text-black px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl hover:bg-gray-200 transition-colors sm:h-fit sm:self-end"
          >
            <img src={plusIcon} alt="New" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">
              New Document
            </span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {/* Pending Documents */}
          <div className="bg-black/40 rounded-xl p-3 border border-white/30">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base text-white mb-1">Pending Docs</h2>
                <p className="text-3xl font-bold">
                  {userData?.pendingDocuments || 0}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Awaiting signatures
                </p>
              </div>
              <img src={pendingIcon} alt="Pending" className="w-5 h-5" />
            </div>
          </div>

          {/* Completed Documents */}
          <div className="bg-black/40 rounded-xl p-3 border border-white/30">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base text-white mb-1">Completed Docs</h2>
                <p className="text-3xl font-bold">
                  {userData?.completedDocuments || 0}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Successfully signed
                </p>
              </div>
              <img src={completedIcon} alt="Completed" className="w-5 h-5" />
            </div>
          </div>

          {/* Templates */}
          <div className="bg-black/40 rounded-xl p-3 border border-white/30">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base text-white mb-1">Templates</h2>
                <p className="text-3xl font-bold">
                  {userData?.templatesCount || 0}
                </p>
                <p className="text-gray-400 text-sm mt-1">Ready to use</p>
              </div>
              <img
                src={templateIcon}
                alt="Templates"
                className="w-5 h-5"
                style={{ opacity: 0.6 }}
              />
            </div>
          </div>

          {/* Total Documents */}
          <div className="bg-black/40 rounded-xl p-3 border border-white/30">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base text-white mb-1">Total Docs</h2>
                <p className="text-3xl font-bold">
                  {userData?.totalDocuments || 0}
                </p>
                <p className="text-gray-400 text-sm mt-1">In your account</p>
              </div>
              <img src={documentIcon} alt="Documents" className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Recent Documents Section */}
        <div className="bg-black/40 rounded-xl border border-white/30 p-3 sm:p-4 min-h-[350px] sm:min-h-[450px] flex flex-col mb-20">
          {/* Desktop Table View */}
          <div className="hidden sm:block flex-1">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-xl font-semibold mb-1">Recent Documents</h2>
                <p className="text-gray-400 text-sm">
                  All the previous documents will be present here
                </p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/40 border border-white/30 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex w-fit rounded-lg border border-white/30 p-0.5 mt-4">
                <button
                  onClick={() => setActiveTab("your")}
                  className={`px-3 py-1.5 rounded-md transition-colors text-sm ${activeTab === "your"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white"
                    }`}
                >
                  Your Documents
                </button>
                <button
                  onClick={() => setActiveTab("received")}
                  className={`px-3 py-1.5 rounded-md transition-colors text-sm ${activeTab === "received"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white"
                    }`}
                >
                  Received Documents
                </button>
              </div>
            </div>
            <div className="rounded-lg border border-white/30">
              {(activeTab === "your" ? filteredDocuments : filteredReceivedDocuments).length === 0 ? (
                <div>
                  {activeTab === "your" && (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/30 bg-black/60">
                          <th className="text-left py-3 px-4 text-gray-400">
                            Title
                          </th>
                          <th className="text-left py-3 px-4 text-gray-400">
                            <div className="relative status-filter">
                              <button
                                onClick={() => setShowStatusFilter(!showStatusFilter)}
                                className="flex items-center gap-2 transition-colors hover:text-white"
                              >
                                Status{" "}
                                {statusFilter.length > 0 && `(${statusFilter.length})`}
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                              {showStatusFilter && (
                                <div className="absolute top-full left-0 mt-1 w-32 bg-black border border-white/30 rounded-lg shadow-lg">
                                  {[
                                    "All",
                                    "draft",
                                    "viewed",
                                    "completed",
                                    "pending",
                                  ].map((status) => (
                                    <button
                                      key={status}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusFilter(status.toLowerCase() as DocumentStatus);
                                      }}
                                      className={`w-full text-left px-3 py-1.5 text-sm flex items-center justify-between ${status === "All"
                                        ? statusFilter.length === 0
                                          ? "text-white bg-black"
                                          : "text-gray-400"
                                        : statusFilter.includes(status.toLowerCase() as DocumentStatus)
                                          ? "text-white bg-black"
                                          : "text-gray-400"
                                        }`}
                                    >
                                      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                      {(status === "All"
                                        ? statusFilter.length === 0
                                        : statusFilter.includes(status.toLowerCase() as DocumentStatus)) && (
                                          <svg
                                            className="w-4 h-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        )}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </th>
                          <th className="text-left py-3 px-4 text-gray-400">
                            Recipients
                          </th>
                          <th className="text-left py-3 px-4 text-gray-400">
                            Actions
                          </th>
                          <th className="text-left py-3 px-4 text-gray-400">
                            Updates
                          </th>
                        </tr>
                      </thead>
                    </table>
                  )}
                  <NoDocumentsMessage type={activeTab} />
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/30 bg-black/60">
                      <th className="text-left py-3 px-4 text-gray-400">
                        Title
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400">
                        {activeTab === "your" ? (
                          <div className="relative status-filter">
                            <button
                              onClick={() => setShowStatusFilter(!showStatusFilter)}
                              className="flex items-center gap-2 transition-colors hover:text-white"
                            >
                              Status{" "}
                              {statusFilter.length > 0 && `(${statusFilter.length})`}
                              <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                            {showStatusFilter && (
                              <div className="absolute top-full left-0 mt-1 w-32 bg-black border border-white/30 rounded-lg shadow-lg z-50">
                                {[
                                  "All",
                                  "draft",
                                  "viewed",
                                  "completed",
                                  "pending",
                                ].map((status) => (
                                  <button
                                    key={status}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusFilter(status.toLowerCase() as DocumentStatus);
                                    }}
                                    className={`w-full text-left px-3 py-1.5 text-sm flex items-center justify-between ${status === "All"
                                      ? statusFilter.length === 0
                                        ? "text-white bg-black"
                                        : "text-gray-400"
                                      : statusFilter.includes(status.toLowerCase() as DocumentStatus)
                                        ? "text-white bg-black"
                                        : "text-gray-400"
                                      }`}
                                  >
                                    <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                    {(status === "All"
                                      ? statusFilter.length === 0
                                      : statusFilter.includes(status.toLowerCase() as DocumentStatus)) && (
                                        <svg
                                          className="w-4 h-4"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                      )}
                                  </button>
                                ))}
                              </div>
                            )}
                            </div>
                          ) : (
                            "Status"
                          )}
                        </th>
                      <th className="text-left py-3 px-4 text-gray-400">
                        Recipients
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400">
                        Actions
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400">
                        Updates
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  {paginatedDocuments.map((doc, index) => (
                      <tr key={doc.documentKey} className="border-b border-white/10">
                        {activeTab === "your" ? (
                          <>
                            <td className="py-4 px-4">
                              <span
                                className="inline-block max-w-[200px] truncate"
                                title={doc.title}
                              >
                                {truncateText(doc.title)}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2 text-gray-400">
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={
                                      doc.status === "completed"
                                        ? "M5 13l4 4L19 7"
                                        : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    }
                                  />
                                </svg>
                                {doc.status}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex">
                                {doc.recipients
                                  .slice(0, 3)
                                  .map((recipient, idx) => (
                                    <div
                                      key={recipient.email}
                                      className={`w-8 h-8 rounded-full border-2 border-black overflow-hidden ${idx > 0 ? "-ml-3" : ""
                                        }`}
                                    >
                                      <img
                                        src={recipient.recipientsAvatar}
                                        alt={recipient.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                {doc.recipients.length > 3 && (
                                  <div className="w-8 h-8 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-xs text-white -ml-3">
                                    +{doc.recipients.length - 3}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handlePreviewDocument(doc)}
                                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-black/40 border border-white/30 rounded-lg"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  View
                                </button>
                                {doc.status.toLowerCase() === "draft" ? (
                                  <button
                                    onClick={() => handleCompleteDraft(doc)}
                                    className="px-3 py-1.5 text-sm bg-black/40 border border-white/30 rounded-lg hover:bg-blue-600/40 hover:border-blue-500/50 hover:text-blue-500 transition-all"
                                  >
                                    Complete
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleSendReminder(doc)}
                                    className="px-3 py-1.5 text-sm bg-black/40 border border-white/30 rounded-lg"
                                  >
                                    Send Reminder
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    handleDeleteDocument(
                                      doc.title,
                                      doc.documentKey,
                                      doc.status.toLowerCase() === 'draft' ? 'draft' : 'agreement'
                                    )
                                  }
                                  className="p-1.5 text-sm bg-black/40 border border-white/30 rounded-lg hover:bg-red-600/40 hover:border-red-500/50 hover:text-red-500 transition-all"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-400">
                              <div className="flex items-center gap-2 group relative">
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="truncate max-w-[250px]">
                                  {getRecipientUpdateText(doc)}
                                </span>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-4 px-4">
                              <span
                                className="inline-block max-w-[200px] truncate"
                                title={doc.title}
                              >
                                {truncateText(doc.title)}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                  <img
                                    src={
                                      doc.recipients[0]?.recipientsAvatar || ""
                                    }
                                    alt={doc.recipients[0]?.name || ""}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="text-gray-400">
                                  {doc.recipients[0]?.name || "Unknown"}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2 text-gray-400">
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={
                                      doc.status === "completed"
                                        ? "M5 13l4 4L19 7"
                                        : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    }
                                  />
                                </svg>
                                {doc.status}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-400">
                              {doc.recipients[0]?.updates || "No updates"}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handlePreviewDocument(doc)}
                                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-black/40 border border-white/30 rounded-lg"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  View
                                </button>
                                {doc.status.toLowerCase() === "pending" && (
                                  <button
                                    onClick={() =>
                                      navigate(`/sign/${doc.documentKey}`, {
                                        state: { agreement: doc }
                                      })
                                    }
                                    className="px-3 py-1.5 text-sm bg-black/40 border border-white/30 rounded-lg hover:bg-blue-600/40 hover:border-blue-500/50 hover:text-blue-500 transition-all"
                                  >
                                    Sign
                                  </button>
                                )}
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                  <PaginationControls 
  totalDocuments={
    activeTab === "your" 
      ? filteredDocuments.length 
      : filteredReceivedDocuments.length
  } 
/>
                </table>
              )}
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden flex-1">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1">Recent Documents</h2>
              <p className="text-gray-400 text-sm">
                All the previous documents will be present here
              </p>
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Mobile Tab Switcher */}
            <div className="flex rounded-lg border border-white/30 p-1 mb-4">
              <button
                onClick={() => setActiveTab("your")}
                className={`flex-1 px-4 py-2 rounded-md transition-colors ${activeTab === "your"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                Your Documents
              </button>
              <button
                onClick={() => setActiveTab("received")}
                className={`flex-1 px-4 py-2 rounded-md transition-colors ${activeTab === "received"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                Received Documents
              </button>
            </div>

            <div className="space-y-3">
              {(activeTab === "your"
                ? filteredDocuments
                : filteredReceivedDocuments
              ).length === 0 ? (
                <NoDocumentsMessage type={activeTab} />
              ) : (
                (activeTab === "your"
                  ? filteredDocuments
                  : filteredReceivedDocuments
                ).map((doc, index) => (
                  <div
                    key={doc.documentKey}
                    className="bg-black/40 rounded-xl border border-white/30 p-4"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3
                        className="text-lg font-medium truncate max-w-[200px]"
                        title={doc.title}
                      >
                        {truncateText(doc.title)}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePreviewDocument(doc)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-black/40 border border-white/30 rounded-lg"
                        >
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View
                        </button>
                        {activeTab === "your" ? (
                          <>
                            {doc.status.toLowerCase() === "draft" ? (
                              <button
                                onClick={() => handleCompleteDraft(doc)}
                                className="px-3 py-1.5 text-sm bg-black/40 border border-white/30 rounded-lg hover:bg-blue-600/40 hover:border-blue-500/50 hover:text-blue-500 transition-all"
                              >
                                Complete
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSendReminder(doc)}
                                className="px-3 py-1.5 text-sm bg-black/40 border border-white/30 rounded-lg"
                              >
                                Send Reminder
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleDeleteDocument(
                                  doc.title,
                                  doc.documentKey,
                                  doc.status.toLowerCase() === 'draft' ? 'draft' : 'agreement'
                                )
                              }
                              className="p-1.5 text-sm bg-black/40 border border-white/30 rounded-lg"
                            >
                              <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </>
                        ) : (
                          doc.status.toLowerCase() === "pending" && (
                            <button
                              onClick={() =>
                                navigate(`/sign/${doc.documentKey}`)
                              }
                              className="px-3 py-1.5 text-sm bg-black/40 border border-white/30 rounded-lg"
                            >
                              Sign
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 mb-2">Status</p>
                        <div className="flex items-center gap-2 text-gray-400">
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={
                                doc.status === "completed"
                                  ? "M5 13l4 4L19 7"
                                  : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              }
                            />
                          </svg>
                          {doc.status}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-2">Recipients</p>
                        <div className="flex -space-x-2">
                          {doc.recipients.slice(0, 3).map((recipient, idx) => (
                            <div
                              key={recipient.email}
                              className="w-8 h-8 rounded-full border-2 border-black overflow-hidden"
                            >
                              <img
                                src={recipient.recipientsAvatar}
                                alt={recipient.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {doc.recipients.length > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-xs text-white">
                              +{doc.recipients.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-400">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm">
                          {getRecipientUpdateText(doc)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-row sm:justify-end items-center mt-4 gap-3">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Page {currentPage} of {Math.ceil((activeTab === "your" ? filteredDocuments.length : filteredReceivedDocuments.length) / documentsPerPage)}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/30 bg-black/40 text-gray-400 disabled:opacity-50"
                  disabled={currentPage === 1}
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil((activeTab === "your" ? filteredDocuments.length : filteredReceivedDocuments.length) / documentsPerPage)))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/30 bg-black/40 text-gray-400 disabled:opacity-50"
                  disabled={currentPage === Math.ceil((activeTab === "your" ? filteredDocuments.length : filteredReceivedDocuments.length) / documentsPerPage)}
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div >
      {showPreview && selectedDocument && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black/90 rounded-xl border border-white/30 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-white/30 flex justify-between items-center">
              <h3 className="text-lg font-medium">{selectedDocument.title}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-6">
                {selectedDocument.pages.map((page, index) => (
                  <div key={index} className="border border-white/30 rounded-lg overflow-hidden relative">
                    <img src={page} alt={`Page ${index + 1}`} className="w-full h-auto" />
                    {selectedDocument.placeholders
                      ?.filter((p) => p.pageNumber === index + 1)
                      .map((placeholder, pIndex) => (
                        <div
                          key={pIndex}
                          style={{
                            position: "absolute",
                            left: placeholder.position.x,
                            top: placeholder.position.y,
                            width: placeholder.size.width,
                            height: placeholder.size.height,
                            pointerEvents: "none",
                            transform: "translate(0%, 0%)"
                          }}
                          className="border-2 border-blue-500 rounded-md bg-blue-500/10"
                        >
                          <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-tl-md rounded-br-md whitespace-nowrap">
                            {placeholder.type}
                          </div>
                          <div className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-tr-md rounded-bl-md whitespace-nowrap">
                            {placeholder.assignedTo}
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {
        showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-black/90 rounded-xl border border-white/30 w-full max-w-md p-6">
              <h3 className="text-xl font-medium mb-4">Delete Document</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "{documentToDelete}"? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-white/30 text-gray-400 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      if (!token || !documentKeyToDelete) return;

                      const response = await fetch(
                        "https://server.signbuddy.in/api/v1/deleteagreement",
                        {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            key: documentKeyToDelete,
                            type: documentTypeToDelete
                          })
                        }
                      );

                      if (response.ok) {
                        // Remove the document from the local state
                        setRecentDocuments((prev) =>
                          prev.filter(
                            (doc) => doc.documentKey !== documentKeyToDelete
                          )
                        );
                        alert("Document deleted successfully");
                      } else {
                        throw new Error("Failed to delete document");
                      }
                    } catch (error) {
                      console.error("Error deleting document:", error);
                      alert("Failed to delete document");
                    } finally {
                      setShowDeleteConfirm(false);
                      setDocumentToDelete(null);
                      setDocumentKeyToDelete(null);
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600/40 border border-red-500/50 text-red-500 hover:bg-red-600/60 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Dashboard;
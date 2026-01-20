"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import usersData from "@/db/users.json";

type UserRow = {
  beneficiary_id: string;
  name: string;
  aadhar_no: string;
  state: string;
  district: string;
  address: string;
  no_of_grants: number;
};

type Grant = {
  grant_id: string;
  ngo_name: string;
  scheme_name: string;
  amount: number;
  date_awarded: string;
  status: "Completed" | "In Progress" | "On Hold";
  outcome_percentage: number;
  duration_months: number;
  category: string;
  project_title: string;
  beneficiary_feedback: string;
  documents: Array<{
    name: string;
    type: string;
    uploaded_date: string;
  }>;
  milestones: Array<{
    title: string;
    status: "Completed" | "In Progress" | "Pending";
    date: string;
  }>;
};

const generateSyntheticGrants = (
  beneficiary_id: string,
  count: number
): Grant[] => {
  const ngos = [
    "Smile Foundation",
    "CRY - Child Rights and You",
    "Goonj",
    "Akshaya Patra Foundation",
    "Pratham Education Foundation",
    "Helpage India",
    "Nanhi Kali",
    "Teach For India",
    "Magic Bus India Foundation",
    "Udayan Care",
  ];
  const schemes = [
    "Education Support Program",
    "Healthcare Initiative",
    "Skill Development Training",
    "Women Empowerment Scheme",
    "Rural Infrastructure Development",
    "Child Nutrition Program",
    "Livelihood Enhancement",
    "Digital Literacy Mission",
    "Agricultural Support",
    "Housing Assistance",
  ];
  const categories = [
    "Education",
    "Healthcare",
    "Skill Development",
    "Women Empowerment",
    "Infrastructure",
    "Nutrition",
    "Livelihood",
    "Technology",
    "Agriculture",
    "Housing",
  ];
  const statuses: Array<"Completed" | "In Progress" | "On Hold"> = [
    "Completed",
    "In Progress",
    "On Hold",
  ];

  return Array.from({ length: count }, (_, i) => {
    const ngo = ngos[Math.floor(Math.random() * ngos.length)];
    const scheme = schemes[Math.floor(Math.random() * schemes.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const status =
      i === count - 1 && count < 5
        ? "In Progress"
        : i < count - 1
        ? "Completed"
        : statuses[Math.floor(Math.random() * statuses.length)];
    const outcome =
      status === "Completed"
        ? 75 + Math.floor(Math.random() * 25)
        : status === "In Progress"
        ? 40 + Math.floor(Math.random() * 50)
        : 20 + Math.floor(Math.random() * 30);
    const monthsAgo = (count - i) * 8 + Math.floor(Math.random() * 4);
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);

    return {
      grant_id: `GR-${beneficiary_id.slice(-4)}-${String(i + 1).padStart(
        3,
        "0"
      )}`,
      ngo_name: ngo,
      scheme_name: scheme,
      amount: 25000 + Math.floor(Math.random() * 75000),
      date_awarded: date.toISOString().split("T")[0],
      status,
      outcome_percentage: outcome,
      duration_months: 6 + Math.floor(Math.random() * 18),
      category,
      project_title: `${category} Project - ${scheme}`,
      beneficiary_feedback:
        status === "Completed"
          ? "The program has significantly improved my quality of life. The support provided was timely and effective."
          : status === "In Progress"
          ? "Currently participating in the program. The initial results are encouraging."
          : "Program temporarily on hold due to administrative reasons.",
      documents: [
        {
          name: "Grant Agreement.pdf",
          type: "Contract",
          uploaded_date: date.toISOString().split("T")[0],
        },
        {
          name: "Utilization Certificate.pdf",
          type: "UC",
          uploaded_date: new Date(date.getTime() + 90 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
        {
          name: "Progress Report.pdf",
          type: "Report",
          uploaded_date: new Date(date.getTime() + 120 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
        {
          name: "Completion Certificate.pdf",
          type: "Certificate",
          uploaded_date:
            status === "Completed"
              ? new Date(date.getTime() + 180 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0]
              : "N/A",
        },
      ],
      milestones: [
        {
          title: "Project Initiation",
          status: "Completed",
          date: date.toISOString().split("T")[0],
        },
        {
          title: "Mid-term Review",
          status:
            status === "Completed" || status === "In Progress"
              ? "Completed"
              : "In Progress",
          date: new Date(date.getTime() + 90 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
        {
          title: "Final Assessment",
          status: status === "Completed" ? "Completed" : "Pending",
          date:
            status === "Completed"
              ? new Date(date.getTime() + 180 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0]
              : "Pending",
        },
      ],
    };
  });
};

export default function BeneficiaryVerifyPage() {
  const [rows, setRows] = useState<
    (UserRow & { verified?: boolean; onHold?: boolean; holdStart?: number })[]
  >(() =>
    usersData.map((u: any) => ({
      beneficiary_id: String(
        u.Aadhar ??
          u.Aadhaar ??
          u.Aadhar_No ??
          u.aadhar ??
          u.aadhar_no ??
          u.Name ??
          ""
      ),
      name: u.Name ?? u.name ?? "",
      aadhar_no: String(
        u.Aadhar ?? u.Aadhaar ?? u.Aadhar_No ?? u.aadhar ?? u.aadhar_no ?? ""
      ),
      state: u.State ?? u.state ?? "",
      district: u.District ?? u.district ?? "",
      address: u.Address ?? u.address ?? "",
      no_of_grants: Number(
        u.No_of_Grants_Accessed ??
          u.No_of_Grants ??
          u.No_of_Grants_Accessed ??
          u.No_of_grants ??
          0
      ),
      verified: false,
      onHold:
        Number(
          u.No_of_Grants_Accessed ?? u.No_of_Grants ?? u.No_of_grants ?? 0
        ) === 5,
      holdStart:
        Number(
          u.No_of_Grants_Accessed ?? u.No_of_Grants ?? u.No_of_grants ?? 0
        ) === 5
          ? Date.now()
          : undefined,
    }))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [now, setNow] = useState<number>(Date.now());
  const [filterState, setFilterState] = useState<string>("all");
  const [filterDistrict, setFilterDistrict] = useState<string>("all");
  const [filterGrants, setFilterGrants] = useState<string>("all");
  const [filterVerified, setFilterVerified] = useState<string>("all");
  const [filterHold, setFilterHold] = useState<string>("all");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<
    | (UserRow & { verified?: boolean; onHold?: boolean; holdStart?: number })
    | null
  >(null);
  const [beneficiaryGrants, setBeneficiaryGrants] = useState<Grant[]>([]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const states = useMemo(
    () => Array.from(new Set(rows.map((r) => r.state))).sort(),
    [rows]
  );
  const districts = useMemo(() => {
    if (filterState === "all") {
      return Array.from(new Set(rows.map((r) => r.district))).sort();
    }
    return Array.from(
      new Set(
        rows.filter((r) => r.state === filterState).map((r) => r.district)
      )
    ).sort();
  }, [rows, filterState]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return rows.filter((r) => {
      const matchesSearch =
        !q ||
        r.beneficiary_id.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.state.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q);

      const matchesState = filterState === "all" || r.state === filterState;
      const matchesDistrict =
        filterDistrict === "all" || r.district === filterDistrict;
      const matchesGrants =
        filterGrants === "all" || r.no_of_grants === Number(filterGrants);
      const matchesVerified =
        filterVerified === "all" ||
        (filterVerified === "verified" ? !!r.verified : !r.verified);
      const matchesHold =
        filterHold === "all" || (filterHold === "on" ? !!r.onHold : !r.onHold);

      return (
        matchesSearch &&
        matchesState &&
        matchesDistrict &&
        matchesGrants &&
        matchesVerified &&
        matchesHold
      );
    });
  }, [
    rows,
    searchQuery,
    filterState,
    filterDistrict,
    filterGrants,
    filterVerified,
    filterHold,
  ]);

  const grantsColor = (n: number) => {
    if (n <= 0) return "bg-white";
    if (n >= 5) return "bg-red-600";
    const shades = ["bg-red-100", "bg-red-200", "bg-red-300", "bg-red-400"];
    return shades[n - 1] || "bg-red-100";
  };

  const getCountdownFrom = (start?: number) => {
    if (!start) return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    const threeMonthsMs = 90 * 24 * 60 * 60 * 1000;
    const target = start + threeMonthsMs;
    let diff = target - now;
    if (diff < 0) diff = 0;
    const months = Math.floor(diff / (30 * 24 * 60 * 60 * 1000));
    const days = Math.floor(
      (diff % (30 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)
    );
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);
    return { months, days, hours, minutes, seconds };
  };

  const handleVerify = (beneficiary_id: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.beneficiary_id === beneficiary_id ? { ...r, verified: true } : r
      )
    );
  };

  const handleRemoveHold = (beneficiary_id: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.beneficiary_id === beneficiary_id
          ? { ...r, onHold: false, holdStart: undefined }
          : r
      )
    );
  };

  const handleRowClick = (
    row: UserRow & { verified?: boolean; onHold?: boolean; holdStart?: number }
  ) => {
    setSelectedBeneficiary(row);
    if (row.no_of_grants > 0) {
      setBeneficiaryGrants(
        generateSyntheticGrants(row.beneficiary_id, row.no_of_grants)
      );
    } else {
      setBeneficiaryGrants([]);
    }
  };

  const handleCloseModal = () => {
    setSelectedBeneficiary(null);
    setBeneficiaryGrants([]);
  };

  const stats = {
    total: rows.length,
    verified: rows.filter((r) => r.verified).length,
    onHold: rows.filter((r) => r.onHold).length,
  };

  // per-row countdown computed in render

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#2C3E50]">
                All Beneficiaries
              </h1>
              <p className="text-gray-600 mt-1">Imported from users.json</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-700">Verified</p>
              <p className="text-2xl font-bold text-green-700">
                {stats.verified}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-700">On Hold (5 grants)</p>
              <p className="text-2xl font-bold text-red-700">{stats.onHold}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search by ID, name, state, district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <select
              value={filterState}
              onChange={(e) => {
                setFilterState(e.target.value);
                setFilterDistrict("all");
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All States</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={filterGrants}
              onChange={(e) => setFilterGrants(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Grants</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <select
              value={filterVerified}
              onChange={(e) => setFilterVerified(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
            <select
              value={filterHold}
              onChange={(e) => setFilterHold(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">Hold: All</option>
              <option value="on">On Hold</option>
              <option value="off">Not on Hold</option>
            </select>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Color Flag
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Beneficiary ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Aadhaar No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      State
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      District
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      No. of Grants Assessed
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((r) => (
                    <tr
                      key={r.beneficiary_id}
                      className="relative border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(r)}
                      onMouseEnter={() =>
                        r.no_of_grants === 5 && setHoveredId(r.beneficiary_id)
                      }
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <td className="px-6 py-4">
                        <div
                          className={`w-4 h-4 rounded ${grantsColor(
                            r.no_of_grants
                          )}`}
                        />
                      </td>
                      <td className="px-6 py-4">{r.beneficiary_id}</td>
                      <td className="px-6 py-4">{r.name}</td>
                      <td className="px-6 py-4">{r.aadhar_no}</td>
                      <td className="px-6 py-4">{r.state}</td>
                      <td className="px-6 py-4">{r.district}</td>
                      <td className="px-6 py-4">{r.address}</td>
                      <td className="px-6 py-4">{r.no_of_grants}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {!r.onHold ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVerify(r.beneficiary_id);
                              }}
                              className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
                            >
                              {r.verified ? "Verified" : "Verify"}
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveHold(r.beneficiary_id);
                              }}
                              className="px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded hover:bg-orange-700 transition-colors"
                            >
                              Remove Hold
                            </button>
                          )}
                        </div>
                      </td>

                      {hoveredId === r.beneficiary_id &&
                        r.no_of_grants === 5 && (
                          <td className="absolute inset-0 bg-black/60 text-white flex items-center justify-center">
                            <div className="flex items-center gap-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6"
                              >
                                <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 116 0v3H9z" />
                              </svg>
                              <span className="font-medium">On Hold:</span>
                              <span>
                                {getCountdownFrom(r.holdStart).months}m{" "}
                                {getCountdownFrom(r.holdStart).days}d{" "}
                                {getCountdownFrom(r.holdStart).hours}h{" "}
                                {getCountdownFrom(r.holdStart).minutes}m{" "}
                                {getCountdownFrom(r.holdStart).seconds}s
                              </span>
                            </div>
                          </td>
                        )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredRows.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No beneficiaries found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Beneficiary Detail Modal */}
        {selectedBeneficiary && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-linear-to-r from-[#EA9000] to-[#D68000] text-white p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedBeneficiary.name}
                  </h2>
                  <p className="text-orange-100">
                    Beneficiary ID: {selectedBeneficiary.beneficiary_id}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
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

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Personal Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Aadhaar Number</p>
                      <p className="font-medium text-gray-900">
                        {selectedBeneficiary.aadhar_no}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">State</p>
                      <p className="font-medium text-gray-900">
                        {selectedBeneficiary.state}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">District</p>
                      <p className="font-medium text-gray-900">
                        {selectedBeneficiary.district}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">
                        {selectedBeneficiary.address}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Grants</p>
                      <p className="font-medium text-gray-900">
                        {selectedBeneficiary.no_of_grants}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium">
                        {selectedBeneficiary.verified ? (
                          <span className="text-green-600">✓ Verified</span>
                        ) : (
                          <span className="text-orange-600">Unverified</span>
                        )}
                        {selectedBeneficiary.onHold && (
                          <span className="ml-2 text-red-600">• On Hold</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grants History */}
                {beneficiaryGrants.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Grants History ({beneficiaryGrants.length})
                    </h3>
                    <div className="space-y-6">
                      {beneficiaryGrants.map((grant) => (
                        <div
                          key={grant.grant_id}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          {/* Grant Header */}
                          <div className="bg-gray-50 p-4 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">
                                  {grant.project_title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Grant ID: {grant.grant_id}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  grant.status === "Completed"
                                    ? "bg-green-100 text-green-700"
                                    : grant.status === "In Progress"
                                    ? "bg-orange-100 text-[#EA9000]"
                                    : "bg-orange-100 text-orange-700"
                                }`}
                              >
                                {grant.status}
                              </span>
                            </div>
                          </div>

                          {/* Grant Details */}
                          <div className="p-4 space-y-4">
                            {/* Basic Info Grid */}
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">NGO</p>
                                <p className="font-medium text-gray-900">
                                  {grant.ngo_name}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Scheme</p>
                                <p className="font-medium text-gray-900">
                                  {grant.scheme_name}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Category
                                </p>
                                <p className="font-medium text-gray-900">
                                  {grant.category}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Amount</p>
                                <p className="font-medium text-gray-900">
                                  ₹{grant.amount.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Date Awarded
                                </p>
                                <p className="font-medium text-gray-900">
                                  {grant.date_awarded}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Duration
                                </p>
                                <p className="font-medium text-gray-900">
                                  {grant.duration_months} months
                                </p>
                              </div>
                            </div>

                            {/* Outcome Percentage */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <p className="text-sm text-gray-600">
                                  Outcome Achievement
                                </p>
                                <p className="font-semibold text-gray-900">
                                  {grant.outcome_percentage}%
                                </p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    grant.outcome_percentage >= 80
                                      ? "bg-green-500"
                                      : grant.outcome_percentage >= 50
                                      ? "bg-[#EA9000]"
                                      : "bg-orange-500"
                                  }`}
                                  style={{
                                    width: `${grant.outcome_percentage}%`,
                                  }}
                                />
                              </div>
                            </div>

                            {/* Milestones */}
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Milestones
                              </p>
                              <div className="space-y-2">
                                {grant.milestones.map((milestone, mIdx) => (
                                  <div
                                    key={mIdx}
                                    className="flex items-center gap-3"
                                  >
                                    <div
                                      className={`w-3 h-3 rounded-full ${
                                        milestone.status === "Completed"
                                          ? "bg-green-500"
                                          : milestone.status === "In Progress"
                                          ? "bg-[#EA9000]"
                                          : "bg-gray-300"
                                      }`}
                                    />
                                    <div className="flex-1">
                                      <p className="text-sm text-gray-900">
                                        {milestone.title}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {milestone.date}
                                      </p>
                                    </div>
                                    <span
                                      className={`text-xs px-2 py-1 rounded ${
                                        milestone.status === "Completed"
                                          ? "bg-green-50 text-green-700"
                                          : milestone.status === "In Progress"
                                          ? "bg-orange-50 text-[#EA9000]"
                                          : "bg-gray-50 text-gray-600"
                                      }`}
                                    >
                                      {milestone.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Documents */}
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Related Documents
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                {grant.documents.map((doc, dIdx) => (
                                  <div
                                    key={dIdx}
                                    className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-red-600"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                      />
                                    </svg>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-gray-900 truncate">
                                        {doc.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {doc.type} • {doc.uploaded_date}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Feedback */}
                            <div className="bg-orange-50 p-3 rounded-lg">
                              <p className="text-sm font-medium text-[#EA9000] mb-1">
                                Beneficiary Feedback
                              </p>
                              <p className="text-sm text-orange-800">
                                "{grant.beneficiary_feedback}"
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400 mx-auto mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-gray-600 font-medium">
                      No grants have been awarded yet
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      This beneficiary has not received any grants
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}

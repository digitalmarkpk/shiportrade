'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  HelpCircle,
  Lightbulb,
  Globe,
  Package,
  Calendar,
  Building,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0F4C81', '#2E8B57', '#E97451', '#7B68EE', '#FFB347'];

interface DocumentItem {
  id: string;
  name: string;
  required: boolean;
  category: string;
  description: string;
  checked: boolean;
  notes: string;
  validUntil?: string;
}

const INITIAL_DOCUMENTS: DocumentItem[] = [
  // Commercial Documents
  { id: '1', name: 'Commercial Invoice', required: true, category: 'Commercial', description: 'Itemized list of goods with values', checked: false, notes: '' },
  { id: '2', name: 'Packing List', required: true, category: 'Commercial', description: 'Detailed contents of each package', checked: false, notes: '' },
  { id: '3', name: 'Proforma Invoice', required: false, category: 'Commercial', description: 'Preliminary invoice for customs', checked: false, notes: '' },
  { id: '4', name: 'Sales Contract', required: false, category: 'Commercial', description: 'Terms and conditions of sale', checked: false, notes: '' },
  
  // Transport Documents
  { id: '5', name: 'Bill of Lading (B/L)', required: true, category: 'Transport', description: 'Receipt and contract of carriage', checked: false, notes: '' },
  { id: '6', name: 'Air Waybill (AWB)', required: false, category: 'Transport', description: 'Air transport document', checked: false, notes: '' },
  { id: '7', name: 'Truck Bill of Lading', required: false, category: 'Transport', description: 'Road transport document', checked: false, notes: '' },
  { id: '8', name: 'Forwarder Cargo Receipt', required: false, category: 'Transport', description: 'FIATA FCR document', checked: false, notes: '' },
  
  // Customs Documents
  { id: '9', name: 'Export Declaration', required: true, category: 'Customs', description: 'Official export notification', checked: false, notes: '' },
  { id: '10', name: 'Certificate of Origin', required: false, category: 'Customs', description: 'Proof of goods origin', checked: false, notes: '' },
  { id: '11', name: 'HS Code Classification', required: true, category: 'Customs', description: 'Harmonized System codes', checked: false, notes: '' },
  { id: '12', name: 'Export License', required: false, category: 'Customs', description: 'Government export authorization', checked: false, notes: '' },
  
  // Special Documents
  { id: '13', name: 'Insurance Certificate', required: false, category: 'Insurance', description: 'Cargo insurance proof', checked: false, notes: '' },
  { id: '14', name: 'Dangerous Goods Declaration', required: false, category: 'Special', description: 'DG goods declaration', checked: false, notes: '' },
  { id: '15', name: 'Phytosanitary Certificate', required: false, category: 'Special', description: 'Plant health certificate', checked: false, notes: '' },
  { id: '16', name: 'Fumigation Certificate', required: false, category: 'Special', description: 'Wood treatment proof', checked: false, notes: '' },
  { id: '17', name: 'Quality Inspection Certificate', required: false, category: 'Special', description: 'Quality verification', checked: false, notes: '' },
  { id: '18', name: 'Letter of Credit Documents', required: false, category: 'Financial', description: 'LC required documents', checked: false, notes: '' },
];

export default function ExportDocumentationChecklist() {
  const [activeTab, setActiveTab] = useState('checklist');
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [destinationCountry, setDestinationCountry] = useState('United States');
  const [incoterm, setIncoterm] = useState('FOB');
  const [paymentMethod, setPaymentMethod] = useState('T/T');
  const [transportMode, setTransportMode] = useState('ocean');

  const toggleDocument = (id: string) => {
    setDocuments(
      documents.map((doc) => (doc.id === id ? { ...doc, checked: !doc.checked } : doc))
    );
  };

  const updateNotes = (id: string, notes: string) => {
    setDocuments(
      documents.map((doc) => (doc.id === id ? { ...doc, notes } : doc))
    );
  };

  const stats = useMemo(() => {
    const requiredDocs = documents.filter((d) => d.required);
    const optionalDocs = documents.filter((d) => !d.required);
    
    const completedRequired = requiredDocs.filter((d) => d.checked).length;
    const completedOptional = optionalDocs.filter((d) => d.checked).length;
    
    const completionRate = (completedRequired / requiredDocs.length) * 100;
    const isComplete = completedRequired === requiredDocs.length;
    
    const missingRequired = requiredDocs.filter((d) => !d.checked);
    
    const byCategory = documents.reduce((acc, doc) => {
      if (!acc[doc.category]) {
        acc[doc.category] = { total: 0, completed: 0 };
      }
      acc[doc.category].total++;
      if (doc.checked) acc[doc.category].completed++;
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    return {
      requiredDocs: requiredDocs.length,
      optionalDocs: optionalDocs.length,
      completedRequired,
      completedOptional,
      completionRate,
      isComplete,
      missingRequired,
      byCategory,
    };
  }, [documents]);

  const chartData = useMemo(() => {
    return Object.entries(stats.byCategory).map(([name, data]) => ({
      name,
      Completed: data.completed,
      Remaining: data.total - data.completed,
    }));
  }, [stats]);

  const completionPieData = useMemo(() => {
    return [
      { name: 'Completed', value: stats.completedRequired, color: '#2E8B57' },
      { name: 'Pending', value: stats.requiredDocs - stats.completedRequired, color: '#E97451' },
    ];
  }, [stats]);

  const recommendations = useMemo(() => {
    const recs: string[] = [];
    
    if (paymentMethod === 'L/C') {
      recs.push('Letter of Credit requires strict document compliance - verify all LC terms match documents');
    }
    if (transportMode === 'air') {
      recs.push('Air shipments require Air Waybill instead of Ocean Bill of Lading');
    }
    if (destinationCountry === 'United States') {
      recs.push('US imports require ISF filing 24 hours before vessel departure');
    }
    if (incoterm === 'CIF' || incoterm === 'CIP') {
      recs.push('CIF/CIP terms require insurance certificate - ensure coverage is in place');
    }
    
    stats.missingRequired.forEach((doc) => {
      recs.push(`Missing required: ${doc.name}`);
    });

    return recs;
  }, [paymentMethod, transportMode, destinationCountry, incoterm, stats.missingRequired]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 bg-[#0F4C81] rounded-xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F4C81] dark:text-white">
                Export Documentation Checklist
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Track and verify all required export documents for compliant shipments
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
          {[
            { id: 'checklist', label: 'Checklist', icon: CheckCircle },
            { id: 'progress', label: 'Progress', icon: Package },
            { id: 'requirements', label: 'Requirements', icon: Globe },
            { id: 'tips', label: 'Pro Tips', icon: Lightbulb },
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#0F4C81] text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Checklist Tab */}
        {activeTab === 'checklist' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* Shipment Details */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Shipment Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Destination Country
                  </label>
                  <input
                    type="text"
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Incoterm
                  </label>
                  <select
                    value={incoterm}
                    onChange={(e) => setIncoterm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  >
                    <option value="EXW">EXW - Ex Works</option>
                    <option value="FOB">FOB - Free on Board</option>
                    <option value="CIF">CIF - Cost, Insurance, Freight</option>
                    <option value="CIP">CIP - Carriage & Insurance Paid</option>
                    <option value="DAP">DAP - Delivered at Place</option>
                    <option value="DDP">DDP - Delivered Duty Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  >
                    <option value="T/T">T/T - Wire Transfer</option>
                    <option value="L/C">L/C - Letter of Credit</option>
                    <option value="D/P">D/P - Documents against Payment</option>
                    <option value="D/A">D/A - Documents against Acceptance</option>
                    <option value="Open">Open Account</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Transport Mode
                  </label>
                  <select
                    value={transportMode}
                    onChange={(e) => setTransportMode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  >
                    <option value="ocean">Ocean Freight</option>
                    <option value="air">Air Freight</option>
                    <option value="road">Road Transport</option>
                    <option value="rail">Rail Transport</option>
                    <option value="multimodal">Multimodal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Progress Summary */}
            <div className={`p-4 rounded-xl ${stats.isComplete ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'}`}>
              <div className="flex items-center gap-4">
                {stats.isComplete ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                )}
                <div>
                  <div className={`font-semibold ${stats.isComplete ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                    {stats.isComplete ? 'All Required Documents Complete' : `${stats.requiredDocs - stats.completedRequired} Required Documents Missing`}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {stats.completedRequired} of {stats.requiredDocs} required documents completed ({stats.completionRate.toFixed(0)}%)
                  </div>
                </div>
              </div>
            </div>

            {/* Documents by Category */}
            {Object.entries(
              documents.reduce((acc, doc) => {
                if (!acc[doc.category]) acc[doc.category] = [];
                acc[doc.category].push(doc);
                return acc;
              }, {} as Record<string, DocumentItem[]>)
            ).map(([category, docs]) => (
              <div
                key={category}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700"
              >
                <div className="p-4 bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                  <h4 className="font-semibold text-slate-800 dark:text-white">{category} Documents</h4>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {docs.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        doc.checked ? 'bg-green-50/50 dark:bg-green-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleDocument(doc.id)}
                          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            doc.checked
                              ? 'bg-green-500 border-green-500'
                              : doc.required
                              ? 'border-red-400'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {doc.checked && <CheckCircle className="w-4 h-4 text-white" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-800 dark:text-white">{doc.name}</span>
                            {doc.required ? (
                              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full">
                                Required
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                                Optional
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{doc.description}</p>
                          <input
                            type="text"
                            placeholder="Add notes..."
                            value={doc.notes}
                            onChange={(e) => updateNotes(doc.id, e.target.value)}
                            className="mt-2 w-full px-3 py-1 text-sm border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            {/* Completion Gauge */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 text-center">
                Documentation Completion Status
              </h3>
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="16"
                      className="text-slate-200 dark:text-slate-700"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke={stats.completionRate === 100 ? '#2E8B57' : stats.completionRate >= 50 ? '#FFB347' : '#E97451'}
                      strokeWidth="16"
                      strokeDasharray={`${stats.completionRate * 5.03} 503`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-slate-800 dark:text-white">
                      {stats.completionRate.toFixed(0)}%
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Complete</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Progress by Category
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Completed" stackId="a" fill="#2E8B57" />
                      <Bar dataKey="Remaining" stackId="a" fill="#E97451" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Required Documents Status
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={completionPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {completionPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Missing Documents Alert */}
            {stats.missingRequired.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-700 dark:text-red-300 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Missing Required Documents
                </h4>
                <ul className="space-y-2">
                  {stats.missingRequired.map((doc) => (
                    <li key={doc.id} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <XCircle className="w-4 h-4 text-red-500" />
                      {doc.name} - {doc.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {/* Requirements Tab */}
        {activeTab === 'requirements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                Document Requirements by Scenario
              </h3>

              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      rec.startsWith('Missing')
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                    }`}
                  >
                    <p className="text-slate-700 dark:text-slate-300">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Requirements Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  When Documents Are Required
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">Document</th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">Always</th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">L/C Payment</th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">CIF Terms</th>
                      <th className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-300">Dangerous Goods</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    <tr>
                      <td className="px-4 py-3 text-slate-800 dark:text-white">Commercial Invoice</td>
                      <td className="px-4 py-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                      <td className="px-4 py-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                      <td className="px-4 py-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                      <td className="px-4 py-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-800 dark:text-white">Bill of Lading</td>
                      <td className="px-4 py-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                      <td className="px-4 py-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                      <td className="px-4 py-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                      <td className="px-4 py-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-800 dark:text-white">Insurance Certificate</td>
                      <td className="px-4 py-3 text-center">-</td>
                      <td className="px-4 py-3 text-center">Varies</td>
                      <td className="px-4 py-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                      <td className="px-4 py-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-800 dark:text-white">Certificate of Origin</td>
                      <td className="px-4 py-3 text-center">-</td>
                      <td className="px-4 py-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                      <td className="px-4 py-3 text-center">-</td>
                      <td className="px-4 py-3 text-center">-</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-800 dark:text-white">DG Declaration</td>
                      <td className="px-4 py-3 text-center">-</td>
                      <td className="px-4 py-3 text-center">-</td>
                      <td className="px-4 py-3 text-center">-</td>
                      <td className="px-4 py-3 text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                Export Documentation Best Practices
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      Start Early
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Begin document preparation at least 2 weeks before shipment. Some certificates (origin, phytosanitary) require processing time.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      L/C Compliance
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      For L/C payments, documents must match exactly. Even minor discrepancies can cause payment delays or rejections.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                      Digital Copies
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Maintain digital copies of all documents. Cloud storage ensures backup and easy access for future reference.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                      Consistency is Key
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Ensure consistent information across all documents - product descriptions, quantities, weights, and values must match exactly.
                    </p>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                      Verify Requirements
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Check destination country requirements. Some countries require specific certifications or additional documentation.
                    </p>
                  </div>

                  <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                    <h4 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">
                      Original Documents
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Some destinations require original signed documents. Know when originals vs. copies are acceptable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-[#0F4C81]" />
                Frequently Asked Questions
              </h3>

              <div className="space-y-4">
                {[
                  {
                    q: 'What documents are always required for export?',
                    a: 'The essential documents are: Commercial Invoice, Packing List, Bill of Lading (or AWB for air), and Export Declaration. Additional documents depend on destination country, product type, payment terms, and incoterms.',
                  },
                  {
                    q: 'When is a Certificate of Origin required?',
                    a: 'Certificate of Origin is required when claiming preferential duty rates under FTAs, when the buyer requests it, or when required by L/C terms. It may also be required by certain destination countries for customs clearance.',
                  },
                  {
                    q: 'What documents are needed for Letter of Credit payment?',
                    a: 'L/C documents must match the credit terms exactly. Commonly required: Commercial Invoice, Bill of Lading, Insurance Certificate, Certificate of Origin, Packing List, and Inspection Certificate. Always verify against the specific L/C.',
                  },
                  {
                    q: 'How long should export documents be retained?',
                    a: 'Most jurisdictions require retaining export documents for 5-7 years for customs audit purposes. Some industries (defense, pharmaceuticals) may have longer retention requirements. Always check local regulations.',
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
                  >
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2">{faq.q}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

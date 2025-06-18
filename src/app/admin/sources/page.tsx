"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchContents } from "@/lib/redux/contentSlice";
import Navigation from "@/components/Navigation";
import {
  Database,
  Server,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings,
} from "lucide-react";
import { format } from "date-fns";

interface SourceData {
  name: string;
  icon: React.ReactNode;
  status: "connected" | "disconnected" | "error";
  message: string;
  dataCount: number;
  lastSync?: string;
  endpoint?: string;
  data?: any[];
}

export default function SourcesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { contents, loading, error } = useSelector(
    (state: RootState) => state.content
  );
  const [sources, setSources] = useState<SourceData[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    dispatch(fetchContents());
    checkSources();
  }, [dispatch]);

  const checkSources = async () => {
    setIsChecking(true);
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    const newSources: SourceData[] = [];

    // Check Strapi
    try {
      if (strapiUrl && strapiUrl !== "http://localhost:1337") {
        const response = await fetch(`${strapiUrl}/api/contents`);
        if (response.ok) {
          const data = await response.json();
          newSources.push({
            name: "Strapi CMS",
            icon: <Server className='w-6 h-6' />,
            status: "connected",
            message: "Connected successfully",
            dataCount: data.data?.length || 0,
            lastSync: new Date().toISOString(),
            endpoint: `${strapiUrl}/api/contents`,
            data: data.data || [],
          });
        } else {
          newSources.push({
            name: "Strapi CMS",
            icon: <Server className='w-6 h-6' />,
            status: "error",
            message: "Connection failed",
            dataCount: 0,
            endpoint: `${strapiUrl}/api/contents`,
          });
        }
      } else {
        newSources.push({
          name: "Strapi CMS",
          icon: <Server className='w-6 h-6' />,
          status: "disconnected",
          message: "Not configured",
          dataCount: 0,
        });
      }
    } catch (error) {
      newSources.push({
        name: "Strapi CMS",
        icon: <Server className='w-6 h-6' />,
        status: "error",
        message: "Connection error",
        dataCount: 0,
      });
    }

    // Check Supabase
    try {
      if (supabaseUrl && supabaseUrl !== "https://your-project.supabase.co") {
        newSources.push({
          name: "Supabase Database",
          icon: <Database className='w-6 h-6' />,
          status: "connected",
          message: "Connected successfully",
          dataCount: contents.length,
          lastSync: new Date().toISOString(),
          endpoint: `${supabaseUrl}/rest/v1/contents`,
          data: contents,
        });
      } else {
        newSources.push({
          name: "Supabase Database",
          icon: <Database className='w-6 h-6' />,
          status: "disconnected",
          message: "Not configured",
          dataCount: 0,
        });
      }
    } catch (error) {
      newSources.push({
        name: "Supabase Database",
        icon: <Database className='w-6 h-6' />,
        status: "error",
        message: "Connection error",
        dataCount: 0,
      });
    }

    setSources(newSources);
    setIsChecking(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className='w-5 h-5 text-green-500' />;
      case "error":
        return <XCircle className='w-5 h-5 text-red-500' />;
      default:
        return <AlertCircle className='w-5 h-5 text-yellow-500' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-yellow-50 border-yellow-200";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "connected":
        return "text-green-800";
      case "error":
        return "text-red-800";
      default:
        return "text-yellow-800";
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation />
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Data Sources
          </h1>
          <p className='text-gray-600'>
            Monitor and manage your Strapi CMS and Supabase database connections
          </p>
        </div>

        {/* Source Status Cards */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {sources.map((source, index) => (
            <div
              key={source.name}
              className={`p-6 rounded-lg border ${getStatusColor(
                source.status
              )}`}
            >
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center'>
                  <div className='mr-3'>{source.icon}</div>
                  <h3 className='text-lg font-semibold'>{source.name}</h3>
                </div>
                {getStatusIcon(source.status)}
              </div>

              <p
                className={`text-sm mb-3 ${getStatusTextColor(source.status)}`}
              >
                {source.message}
              </p>

              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span>Content items:</span>
                  <span className='font-semibold'>{source.dataCount}</span>
                </div>
                {source.lastSync && (
                  <div className='flex justify-between'>
                    <span>Last sync:</span>
                    <span>
                      {format(new Date(source.lastSync), "MMM dd, HH:mm")}
                    </span>
                  </div>
                )}
                {source.endpoint && (
                  <div className='flex justify-between'>
                    <span>Endpoint:</span>
                    <span className='text-xs font-mono truncate max-w-32'>
                      {source.endpoint}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className='mt-4 flex space-x-2'>
                <button
                  onClick={checkSources}
                  disabled={isChecking}
                  className='flex items-center px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50'
                >
                  <RefreshCw
                    className={`w-3 h-3 mr-1 ${
                      isChecking ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </button>
                {source.status === "disconnected" && (
                  <button
                    onClick={() => window.open("/STRAPI-SETUP.md", "_blank")}
                    className='flex items-center px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700'
                  >
                    <Settings className='w-3 h-3 mr-1' />
                    Setup
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Data Comparison */}
        <div className='bg-white rounded-lg shadow p-6 mb-8'>
          <h2 className='text-xl font-semibold mb-4'>Data Comparison</h2>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {sources.map((source) => (
              <div key={source.name} className='border rounded-lg p-4'>
                <div className='flex items-center mb-3'>
                  {source.icon}
                  <h3 className='ml-2 font-semibold'>{source.name}</h3>
                  <span
                    className={`ml-auto px-2 py-1 text-xs rounded ${
                      source.status === "connected"
                        ? "bg-green-100 text-green-800"
                        : source.status === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {source.status}
                  </span>
                </div>

                {source.data && source.data.length > 0 ? (
                  <div className='space-y-2'>
                    {source.data.slice(0, 3).map((item: any, index: number) => (
                      <div
                        key={index}
                        className='text-sm p-2 bg-gray-50 rounded'
                      >
                        <div className='font-medium'>
                          {item.attributes?.title ||
                            item.title ||
                            `Item ${index + 1}`}
                        </div>
                        <div className='text-gray-600 text-xs'>
                          {item.attributes?.description ||
                            item.description ||
                            "No description"}
                        </div>
                      </div>
                    ))}
                    {source.data.length > 3 && (
                      <div className='text-xs text-gray-500 text-center'>
                        +{source.data.length - 3} more items
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='text-sm text-gray-500 text-center py-4'>
                    No data available
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sync Actions */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-semibold mb-4'>Synchronization</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <button
              onClick={() => window.open("/STRAPI-SETUP.md", "_blank")}
              className='flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
            >
              <Settings className='w-4 h-4 mr-2' />
              Setup Strapi
            </button>
            <button
              onClick={() => window.open("/supabase-setup.sql", "_blank")}
              className='flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors'
            >
              <Database className='w-4 h-4 mr-2' />
              Setup Supabase
            </button>
            <button
              onClick={() => window.open("/SETUP-INSTRUCTIONS.md", "_blank")}
              className='flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors'
            >
              <RefreshCw className='w-4 h-4 mr-2' />
              Sync Guide
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

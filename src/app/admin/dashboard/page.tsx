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
} from "lucide-react";
import { format } from "date-fns";

interface DataSourceStatus {
  name: string;
  status: "connected" | "disconnected" | "error";
  message: string;
  dataCount: number;
  lastSync?: string;
}

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { contents, loading, error } = useSelector(
    (state: RootState) => state.content
  );
  const [dataSources, setDataSources] = useState<DataSourceStatus[]>([
    {
      name: "Strapi CMS",
      status: "disconnected",
      message: "Not connected",
      dataCount: 0,
    },
    {
      name: "Supabase Database",
      status: "disconnected",
      message: "Not connected",
      dataCount: 0,
    },
  ]);

  useEffect(() => {
    dispatch(fetchContents());
    checkDataSources();
  }, [dispatch]);

  const checkDataSources = async () => {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    const newDataSources = [...dataSources];

    // Check Strapi
    try {
      if (strapiUrl && strapiUrl !== "http://localhost:1337") {
        const response = await fetch(`${strapiUrl}/api/contents`);
        if (response.ok) {
          const data = await response.json();
          newDataSources[0] = {
            name: "Strapi CMS",
            status: "connected",
            message: "Connected successfully",
            dataCount: data.data?.length || 0,
            lastSync: new Date().toISOString(),
          };
        } else {
          newDataSources[0] = {
            name: "Strapi CMS",
            status: "error",
            message: "Connection failed",
            dataCount: 0,
          };
        }
      } else {
        newDataSources[0] = {
          name: "Strapi CMS",
          status: "disconnected",
          message: "Not configured",
          dataCount: 0,
        };
      }
    } catch (error) {
      newDataSources[0] = {
        name: "Strapi CMS",
        status: "error",
        message: "Connection error",
        dataCount: 0,
      };
    }

    // Check Supabase
    try {
      if (supabaseUrl && supabaseUrl !== "https://your-project.supabase.co") {
        newDataSources[1] = {
          name: "Supabase Database",
          status: "connected",
          message: "Connected successfully",
          dataCount: contents.length,
          lastSync: new Date().toISOString(),
        };
      } else {
        newDataSources[1] = {
          name: "Supabase Database",
          status: "disconnected",
          message: "Not configured",
          dataCount: 0,
        };
      }
    } catch (error) {
      newDataSources[1] = {
        name: "Supabase Database",
        status: "error",
        message: "Connection error",
        dataCount: 0,
      };
    }

    setDataSources(newDataSources);
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
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation />
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Admin Dashboard
          </h1>
          <p className='text-gray-600'>
            Monitor your content sources and manage your data
          </p>
        </div>

        {/* Data Sources Status */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          {dataSources.map((source, index) => (
            <div
              key={source.name}
              className={`p-6 rounded-lg border ${getStatusColor(
                source.status
              )}`}
            >
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center'>
                  {source.name === "Strapi CMS" ? (
                    <Server className='w-6 h-6 mr-3' />
                  ) : (
                    <Database className='w-6 h-6 mr-3' />
                  )}
                  <h3 className='text-lg font-semibold'>{source.name}</h3>
                </div>
                {getStatusIcon(source.status)}
              </div>
              <p className='text-sm mb-2'>{source.message}</p>
              <div className='flex items-center justify-between text-sm'>
                <span>Content items: {source.dataCount}</span>
                {source.lastSync && (
                  <span>
                    Last sync:{" "}
                    {format(new Date(source.lastSync), "MMM dd, HH:mm")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className='bg-white rounded-lg shadow p-6 mb-8'>
          <h2 className='text-xl font-semibold mb-4'>Quick Actions</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <button
              onClick={() => (window.location.href = "/admin")}
              className='flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors'
            >
              <Server className='w-4 h-4 mr-2' />
              Manage Content
            </button>
            <button
              onClick={checkDataSources}
              className='flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors'
            >
              <RefreshCw className='w-4 h-4 mr-2' />
              Refresh Status
            </button>
            <button
              onClick={() => window.open("/STRAPI-SETUP.md", "_blank")}
              className='flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors'
            >
              <Database className='w-4 h-4 mr-2' />
              Setup Guide
            </button>
          </div>
        </div>

        {/* Content Overview */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-semibold mb-4'>Content Overview</h2>
          {loading ? (
            <div className='flex justify-center items-center py-8'>
              <RefreshCw className='w-8 h-8 animate-spin text-primary-600' />
            </div>
          ) : error ? (
            <div className='bg-red-50 border border-red-200 rounded-md p-4'>
              <p className='text-red-800'>{error}</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {contents.map((content) => (
                <div key={content.id} className='border rounded-lg p-4'>
                  <h3 className='font-semibold mb-2'>{content.title}</h3>
                  <p className='text-gray-600 text-sm mb-2 line-clamp-2'>
                    {content.description}
                  </p>
                  <div className='text-xs text-gray-500'>
                    <p>
                      Created:{" "}
                      {format(new Date(content.createdAt), "MMM dd, yyyy")}
                    </p>
                    <p>
                      Updated:{" "}
                      {format(new Date(content.updatedAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

export default function ImageForm() {
    const [selectedImage, setSelectedImage] = useState(null);

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*",
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-5xl p-6 bg-white rounded-2xl shadow-xl">
                <form className="flex flex-col md:flex-row gap-8">
                    {/* Dropzone Section */}
                    <div className="md:w-1/2">
                        <label
                            htmlFor="imageUpload"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Upload Image:
                        </label>
                        <div
                            {...getRootProps()}
                            className="flex items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                        >
                            <input {...getInputProps()} id="imageUpload" />
                            <p className="text-sm text-gray-500 text-center px-4">
                                Drag & drop an image here, or click to select
                                one
                            </p>
                        </div>
                        {selectedImage && (
                            <Image
                                src={selectedImage}
                                alt="Selected"
                                className="w-full h-auto rounded-lg shadow-md"
                                width={500}
                                height={500}
                            />
                        )}
                    </div>

                    {/* Form Fields Section */}
                    <div className="md:w-1/2 space-y-4">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-semibold text-gray-700"
                            >
                                Title:
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Enter title"
                                className="mt-1 w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-semibold text-gray-700"
                            >
                                Description:
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Enter description"
                                className="mt-1 w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

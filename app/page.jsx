import Landing from "@/components/Landing";
import Navbar from "@/components/Navbar";
import Navbar from "@/components/Navbar";
import Image from "next/image";
// import ImageForm from "@/components/add-new-legacy/ImageForm";
// import ImageForm from "@/components/add-new-legacy/ImageForm";

export default function Home() {
    return (
        <main>
            <Landing />
        </main>
    );
    return (
        <main>
            <Navbar />

            <div className="flex min-h-screen flex-col items-center justify-between p-24">
                <h1 className="text-3xl font-bold underline">Hello world!</h1>
                {/* <ImageForm /> */}
            </div>
        </main>
    );
}

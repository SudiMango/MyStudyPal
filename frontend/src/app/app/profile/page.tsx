import { Metadata } from "next";
import ProfilePage from "./ProfilePage";

export const metadata: Metadata = {
    title: "Profile",
};

const Page = () => {
    return <ProfilePage />;
};

export default Page;

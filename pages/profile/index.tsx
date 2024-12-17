"use client";

import { Layout } from "@/components/Layouts";
import { ProfileDesktop, ProfileMobile } from "@/components/Sections";
import { useAuth } from "@/context/AuthProvider";
import { useEffect } from "react";

function ProfilePage() {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;
  }, []);

  return (
    <Layout>
      {isLoggedIn && (
        <>
          <div className="hidden lg:block">
            <ProfileDesktop />
          </div>
          <div className="lg:hidden">
            <ProfileMobile />
          </div>
        </>
      )}
    </Layout>
  );
}

export default ProfilePage;

export async function getStaticProps() {
  const locale = "ru";
  return {
    props: {
      messages: (await import(`@/messages/${locale}.json`)).default,
    },
  };
}

import ScrollProgress from "@/components/common/ScrollProgress";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function PublicLayout({ children }: LayoutProps<"/">) {
    return (
        <>
            <ScrollProgress />
            <Header />
            {children}
            <Footer />
        </>
    );
}
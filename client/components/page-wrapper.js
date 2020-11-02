import React from "react";
import Header from "./header";
import Footer from "./footer";

const PageWrapper = ({ children, serverSideProps }) => {
  return (
    <div>
      <Header currentUser={serverSideProps.currentUser} />
      <div className="container">{children}</div>
      <Footer currentUser={serverSideProps.currentUser} />
    </div>
  );
};

export default PageWrapper;

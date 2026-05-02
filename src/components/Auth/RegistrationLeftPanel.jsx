import React from "react";
import { MDBCol } from "mdb-react-ui-kit";
import '../../styles/design-tokens.css';
import '../../styles/auth.css';

export default function RegistrationLeftPanel() {
  return (
    <MDBCol md="6" className="flex-fill d-none d-md-flex p-0 position-relative auth-left">
      <div className="d-flex flex-column justify-content-center ps-5 pe-4 flex-grow-1" style={{ gap: '0.6em' }}>
        {["Stands", "With", "Farmers"].map(word => (
          <span key={word} className="auth-slogan text-center">{word}</span>
        ))}
      </div>
    </MDBCol>
  );
}

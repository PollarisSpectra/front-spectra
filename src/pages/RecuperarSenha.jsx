import React from 'react';
import { Link } from 'react-router-dom';

export default function RecuperarSenha() {
    return (
        <main className="d-flex align-items-start justify-content-center"
              style={{
                  minHeight: '100vh',
                  backgroundColor: '#000',
                  paddingTop: '60px',
                  paddingBottom: '80px'
              }}>

            <div className="container" style={{ maxWidth: '500px', position: 'relative' }}>

                <Link to="/login" className="position-absolute" style={{ left: '-50px', top: '12px', color: 'white' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg>
                </Link>

                <div className="text-center text-white">
                    <h1 className="fw-bold" style={{
                        fontSize: '2.5rem',
                        letterSpacing: '1.5px',
                        lineHeight: '1.1',
                        marginBottom: '90px'
                    }}>
                        RECUPERAÇÃO DE <br /> SENHA
                    </h1>

                    <form className="d-flex flex-column align-items-center">
                        <div className="text-start mb-5 w-100">
                            {/* Label: REDUZIDO */}
                            <label className="fw-bold mb-1" style={{ fontSize: '1rem', color: '#ccc' }}>Email</label>

                            {/* Input: REDUZIDO (fs-5 -> fs-6) */}
                            <input
                                type="email"
                                className="form-control bg-transparent border-0 border-bottom rounded-0 text-white p-0 fs-6"
                                style={{
                                    borderColor: '#fff !important',
                                    boxShadow: 'none',
                                    paddingBottom: '10px'
                                }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn fw-bold mt-3"
                            style={{
                                backgroundColor: '#ff1a1a',
                                color: 'white',
                                borderRadius: '0px',
                                fontSize: '0.95rem',
                                padding: '14px 0',
                                width: '260px',
                                letterSpacing: '1px'
                            }}
                        >
                            ENVIAR E-MAIL
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
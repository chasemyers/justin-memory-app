import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Justin Memory App',
  description: 'Personal chat with long-term memory',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header>
            <h1>Justin Memory App</h1>
            <nav>
              <a href="/">Chat</a>
              <a href="/memory">Memory</a>
              <a href="/settings">Settings</a>
            </nav>
          </header>
          <main>{children}</main>
          <footer>v0.1.1 — You own your data.</footer>
        </div>
      </body>
    </html>
  );
}

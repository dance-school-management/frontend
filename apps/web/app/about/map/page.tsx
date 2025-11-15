export default function Page() {
    return (
        <div className="flex flex-col h-full p-2">
            <div className="flex flex-col">
                <h1 className="text-2xl lg:text-4xl font-bold">Floor Plan</h1>
                <p className="text-muted-foreground">
                    Navigate through our school. Find classrooms and studios.
                </p>
            </div>
            <div className="flex-1 rounded-lg overflow-auto h-full">
                <div className="max-w-4xl mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" aria-label="Dance school floor plan">
                        <style>
                            {`
                                .room {fill: var(--card); stroke: var(--border); stroke-width: 2; rx:6; ry:6; }
                                .label {font-family: Arial, Helvetica, sans-serif; font-size:16px; fill:var(--foreground); pointer-events:none; font-weight:600; }
                                .sub {font-size:12px; fill:var(--muted-foreground); pointer-events:none; }
                                .door {fill:var(--primary); }
                                .entrance {fill:var(--primary); }
                                .hall {fill:var(--secondary); rx:6; ry:6; }
                            `}
                        </style>

                        {/* <!-- Central Hall (open space) --> */}
                        <rect x="262" y="232" width="276" height="334" className="hall" />
                        <text x="400" y="360" textAnchor="middle" className="label">Hall</text>
                        <text x="400" y="380" textAnchor="middle" className="sub">Common / waiting area</text>

                        {/* <!-- Studio D --> */}
                        <rect x="60" y="50" width="680" height="180" className="room" />
                        <text x="400" y="115" textAnchor="middle" className="label">Studio D</text>
                        <text x="400" y="135" textAnchor="middle" className="sub">Large rehearsal hall</text>
                        {/* <!-- Studio D door --> */}
                        <rect x="375" y="224" width="50" height="12" className="door" />

                        {/* <!-- Reception --> */}
                        <rect x="60" y="400" width="200" height="150" className="room" />
                        <text x="160" y="475" textAnchor="middle" className="label">Reception</text>
                        <text x="160" y="495" textAnchor="middle" className="sub">Check-in & info</text>
                        {/* <!-- Reception door --> */}
                        <rect x="254" y="460" width="12" height="36" className="door" />

                        {/* <!-- Studio A --> */}
                        <rect x="540" y="400" width="200" height="150" className="room" />
                        <text x="640" y="475" textAnchor="middle" className="label">Studio A</text>
                        <text x="640" y="495" textAnchor="middle" className="sub">Small practice room</text>
                        {/* <!-- Studio A door --> */}
                        <rect x="534" y="460" width="12" height="36" className="door" />

                        {/* <!-- Studio B --> */}
                        <rect x="60" y="250" width="200" height="130" className="room" />
                        <text x="160" y="310" textAnchor="middle" className="label">Studio B</text>
                        <text x="160" y="330" textAnchor="middle" className="sub">Small practice room</text>
                        {/* <!-- Studio B door --> */}
                        <rect x="254" y="295" width="12" height="36" className="door" />

                        {/* <!-- Studio C --> */}
                        <rect x="540" y="250" width="200" height="130" className="room" />
                        <text x="640" y="310" textAnchor="middle" className="label">Studio C</text>
                        <text x="640" y="330" textAnchor="middle" className="sub">Small mirror room</text>
                        {/* <!-- Studio C door --> */}
                        <rect x="534" y="295" width="12" height="36" className="door" />

                        {/* <!-- Main Entrance --> */}
                        <rect x="350" y="560" width="100" height="10" className="entrance" />
                        <text x="400" y="585" textAnchor="middle" className="label">Main Entrance</text>
                    </svg>
                </div>
            </div>
        </div >
    );
}

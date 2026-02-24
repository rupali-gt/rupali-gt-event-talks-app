const fs = require('fs');

const talksData = [
    {
        title: "Keynote: The Future of AI in Software Development",
        speakers: ["Dr. Alex Chen"],
        category: ["AI", "Software Engineering"],
        duration: 60,
        description: "A deep dive into how artificial intelligence is shaping the landscape of modern software development, from automated code generation to intelligent debugging systems."
    },
    {
        title: "Mastering Modern JavaScript: Beyond ES2023",
        speakers: ["Sarah Jansen"],
        category: ["Web Development", "JavaScript"],
        duration: 60,
        description: "Explore the latest features and best practices in JavaScript, including new syntax, performance optimizations, and upcoming standards."
    },
    {
        title: "Containerization Best Practices with Docker and Kubernetes",
        speakers: ["Mark Thompson", "Emily White"],
        category: ["DevOps", "Cloud"],
        duration: 60,
        description: "Learn how to effectively containerize your applications using Docker and orchestrate them with Kubernetes for scalable and resilient deployments."
    },
    {
        title: "Demystifying Data Science: From Theory to Practice",
        speakers: ["Dr. Laura Kim"],
        category: ["Data Science", "Machine Learning"],
        duration: 60,
        description: "An accessible introduction to data science workflows, covering data collection, analysis, visualization, and model building."
    },
    {
        title: "Building Secure APIs: A Comprehensive Guide",
        speakers: ["David Rodriguez"],
        category: ["Security", "API Development"],
        duration: 60,
        description: "Understand the common vulnerabilities in API design and implementation, and discover strategies to build robust and secure interfaces."
    },
    {
        title: "Effective Communication for Technical Leaders",
        speakers: ["Jessica Lee"],
        category: ["Leadership", "Soft Skills"],
        duration: 60,
        description: "Develop essential communication skills crucial for technical leaders, fostering better team collaboration and project success."
    }
];

const eventStartTime = "10:00"; // Event starts at 10:00 AM
const transitionTime = 10; // minutes
const lunchBreakDuration = 60; // minutes

// Client-side JavaScript as a separate string, with its own template literals escaped for Node.js
const clientSideScript = `
        const talks = ${JSON.stringify(talksData, null, 2)};
        const eventStartTimeStr = "${eventStartTime}";
        const transitionTime = ${transitionTime};
        const lunchBreakDuration = ${lunchBreakDuration};

        const scheduleDiv = document.getElementById('schedule');
        const searchInput = document.getElementById('categorySearch');

        function formatTime(date) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        function calculateScheduleAndRender() {
            let currentTime = new Date();
            const [hours, minutes] = eventStartTimeStr.split(':').map(Number);
            currentTime.setHours(hours, minutes, 0, 0); // Set start time

            scheduleDiv.innerHTML = ''; // Clear existing schedule

            talks.forEach((talk, index) => {
                const talkStartTime = new Date(currentTime);
                const talkEndTime = new Date(currentTime.getTime() + talk.duration * 60 * 1000);

                const talkCard = document.createElement('div');
                talkCard.className = 'talk-card';
                talkCard.setAttribute('data-categories', talk.category.map(c => c.toLowerCase()).join(' '));

                talkCard.innerHTML = \`
                    <span class="time">\${formatTime(talkStartTime)} - \${formatTime(talkEndTime)}</span>
                    <h2>\${talk.title}</h2>
                    <div class="speakers">Speakers: \${talk.speakers.join(', ')}</div>
                    <div class="category-tags">
                        \${talk.category.map(cat => \`<span>\${cat}</span>\`).join('')}
                    </div>
                    <p>\${talk.description}</p>
                \`;
                scheduleDiv.appendChild(talkCard);

                currentTime = new Date(talkEndTime.getTime() + transitionTime * 60 * 1000); // Add transition time

                // Insert lunch break after the 3rd talk (0-indexed, so index 2 is the 3rd talk)
                if (index === 2) {
                    const lunchStartTime = new Date(currentTime);
                    const lunchEndTime = new Date(currentTime.getTime() + lunchBreakDuration * 60 * 1000);

                    const lunchCard = document.createElement('div');
                    lunchCard.className = 'talk-card lunch-break';
                    lunchCard.innerHTML = \`
                        <span class="time">\${formatTime(lunchStartTime)} - \${formatTime(lunchEndTime)}</span>
                        <h2>Lunch Break</h2>
                        <p>Enjoy a delicious meal and network with fellow attendees!</p>
                    \`;
                    scheduleDiv.appendChild(lunchCard);
                    currentTime = new Date(lunchEndTime.getTime() + transitionTime * 60 * 1000); // Add transition after lunch
                }
            });
        }

        function filterTalks() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const allTalkCards = document.querySelectorAll('.talk-card'); // Get all talk and lunch cards

            allTalkCards.forEach(card => {
                // Only filter actual talk cards, not lunch break
                if (!card.classList.contains('lunch-break')) {
                    const categories = card.getAttribute('data-categories');
                    if (searchTerm === '' || categories.includes(searchTerm)) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        }

        searchInput.addEventListener('keyup', filterTalks);
        window.addEventListener('load', calculateScheduleAndRender);
`;

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technical Talks Event Schedule</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f7f6;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 900px;
            margin: 30px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 40px;
            font-size: 2.5em;
            font-weight: 700;
        }
        .search-container {
            margin-bottom: 30px;
            text-align: center;
        }
        .search-container input {
            width: 70%;
            max-width: 400px;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1em;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .talk-schedule {
            display: grid;
            gap: 25px;
        }
        .talk-card {
            background-color: #fff;
            border-left: 5px solid #3498db;
            padding: 20px 25px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .talk-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
        }
        .talk-card.lunch-break {
            border-left: 5px solid #f39c12;
            background-color: #fff8e1;
            text-align: center;
            font-style: italic;
            color: #e67e22;
        }
        .talk-card h2 {
            color: #34495e;
            margin-top: 0;
            font-size: 1.6em;
            font-weight: 600;
        }
        .talk-card .time {
            font-weight: bold;
            color: #3498db;
            font-size: 1.1em;
            margin-bottom: 10px;
            display: block;
        }
        .talk-card .speakers {
            color: #555;
            font-size: 0.95em;
            margin-bottom: 10px;
        }
        .talk-card .category-tags {
            margin-top: 10px;
        }
        .talk-card .category-tags span {
            display: inline-block;
            background-color: #e8f4f8;
            color: #2980b9;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.85em;
            margin-right: 8px;
            margin-bottom: 5px;
            cursor: pointer; /* Indicate that tags are clickable/selectable for search */
        }
        .talk-card p {
            font-size: 0.9em;
            color: #666;
            margin-top: 15px;
        }
        .hidden {
            display: none;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .container {
                margin: 20px auto;
                padding: 20px;
            }
            h1 {
                font-size: 2em;
            }
            .search-container input {
                width: 90%;
            }
            .talk-card h2 {
                font-size: 1.4em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Technical Talks Event Schedule</h1>

        <div class="search-container">
            <input type="text" id="categorySearch" placeholder="Search by category (e.g., Web Development)">
        </div>

        <div id="schedule" class="talk-schedule">
            <!-- Schedule will be dynamically loaded here -->
        </div>
    </div>

    <script>
        ${clientSideScript}
    </script>
</body>
</html>
`;

fs.writeFileSync('index.html', htmlContent, 'utf8');
console.log('index.html has been generated successfully!');
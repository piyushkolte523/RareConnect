import React, { useState } from "react";
import "../styles/EducationHubPage.css";

const EducationHubPage = () => {
    // Sample educational content
    const resources = [
        { id: 1, title: "Understanding Rare Diseases", type: "PDF", link: "https://www.rarediseases.org/wp-content/uploads/2018/08/Rare-Diseases-101.pdf" },
    { id: 2, title: "Genetics & Rare Disorders", type: "Article", link: "https://ghr.nlm.nih.gov/primer/mutationsanddisorders/rarediseases" },
    { id: 3, title: "Managing Symptoms Effectively", type: "Video", link: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 4, title: "AI in Medical Diagnosis", type: "PDF", link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7605401/pdf/main.pdf" },
    { id: 5, title: "Living with Rare Diseases", type: "PDF", link: "https://www.rarediseasesinternational.org/wp-content/uploads/2020/02/Living-with-a-Rare-Disease_2020-EN.pdf" },
    { id: 6, title: "Global Rare Disease Policy Report", type: "PDF", link: "https://www.eurordis.org/wp-content/uploads/2023/01/Rare-Disease-Policy-Report-2022.pdf" },
    { id: 7, title: "The Role of AI in Healthcare", type: "PDF", link: "https://www.who.int/docs/default-source/health-topic-pdfs/ai-for-health.pdf" }
    
    ];

    const [searchTerm, setSearchTerm] = useState("");

    // Filtered resources based on search input
    const filteredResources = resources.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="education-container">
            <h2>🎓 <span className="highlight">Education Hub for Rare Diseases</span></h2>
            <p>Explore educational resources to better understand rare diseases and their management.</p>

            {/* 🔍 AI-powered search */}
            <input
                type="text"
                placeholder="🔍 Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />

            {/* 📚 Resource List */}
            <div className="resource-list">
                {filteredResources.length > 0 ? (
                    filteredResources.map(resource => (
                        <div key={resource.id} className="resource-card">
                            <h4>{resource.title}</h4>
                            {resource.type === "Video" ? (
                                <iframe
                                    src={resource.link}
                                    title={resource.title}
                                    allowFullScreen
                                    className="video-embed"
                                ></iframe>
                            ) : (
                                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="view-btn">
                                    📖 View {resource.type}
                                </a>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No resources found for "{searchTerm}".</p>
                )}
            </div>

            {/* 🎥 Webinars & Quizzes Section */}
            <div className="extra-section">
                <h3>📝 Interactive Quizzes</h3>
                <p>Test your knowledge about rare diseases. <a href="#">Take a quiz</a></p>

                <h3>💬 Join the Discussion</h3>
                <p>Have questions? Join our <a href="/community">Community Forum</a>.</p>
            </div>
        </div>
    );
};

export default EducationHubPage;

import React, { useState, useEffect } from 'react';
import { MessageSquare, BookOpen, Trophy, Users, Search, Filter, Star, ThumbsUp, Eye, Download, Award, Leaf, Target, TrendingUp, Plus, Send, X, Upload, Heart, MessageCircle } from 'lucide-react';
import "./CommunityPage.css";
const CommunityKnowledgeHub = () => {
  const [activeTab, setActiveTab] = useState('forum');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Farming', tags: '' });
  const [newResource, setNewResource] = useState({ title: '', description: '', category: 'Farming', type: 'PDF Guide', file: null });
  const [showRepliesModal, setShowRepliesModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newReply, setNewReply] = useState('');

  // Forum posts state
  const [forumPosts, setForumPosts] = useState([
    {
      id: 1,
      title: "Best drought-resistant crops for semi-arid regions?",
      content: "Looking for advice on crops that can survive with minimal water. Our region has been facing severe droughts and traditional crops are failing. What are your experiences?",
      author: "RajeshFarmer",
      category: "Farming",
      replies: 23,
      views: 456,
      likes: 12,
      liked: false,
      timeAgo: "2 hours ago",
      tags: ["drought", "crops", "climate-adaptation"],
      excerpt: "Looking for advice on crops that can survive with minimal water...",
      replies_data: [
        {
          id: 1,
          author: "FarmExpert",
          content: "I've had great success with millet and sorghum in drought conditions. They're naturally adapted to dry climates.",
          timeAgo: "1 hour ago",
          likes: 5,
          liked: false
        },
        {
          id: 2,
          author: "GreenThumb",
          content: "Don't forget about legumes like cowpeas - they fix nitrogen and are drought tolerant!",
          timeAgo: "45 minutes ago",
          likes: 3,
          liked: false
        }
      ]
    },
    {
      id: 2,
      title: "Solar panel installation - government subsidies available?",
      content: "Can someone guide me through the process of applying for solar panel subsidies? I want to install a 5kW system for my home.",
      author: "GreenEnergy2024",
      category: "Energy",
      replies: 15,
      views: 234,
      likes: 8,
      liked: false,
      timeAgo: "4 hours ago",
      tags: ["solar", "subsidies", "renewable-energy"],
      excerpt: "Can someone guide me through the process of applying for...",
      replies_data: [
        {
          id: 1,
          author: "SolarTech",
          content: "You can apply through the MNRE website. Make sure you have all your property documents ready.",
          timeAgo: "3 hours ago",
          likes: 7,
          liked: false
        }
      ]
    },
    {
      id: 3,
      title: "Community composting initiative - need volunteers",
      content: "Starting a neighborhood composting program. Looking for volunteers and advice on setting up composting bins.",
      author: "EcoWarrior",
      category: "Community",
      replies: 31,
      views: 678,
      likes: 25,
      liked: false,
      timeAgo: "1 day ago",
      tags: ["composting", "community", "waste-management"],
      excerpt: "Starting a neighborhood composting program. Looking for...",
      replies_data: [
        {
          id: 1,
          author: "CompostKing",
          content: "Great initiative! I've been running a similar program for 2 years. Happy to share my experience.",
          timeAgo: "20 hours ago",
          likes: 12,
          liked: false
        },
        {
          id: 2,
          author: "WasteWarrior",
          content: "Count me in! I have experience with setting up collection systems.",
          timeAgo: "18 hours ago",
          likes: 8,
          liked: false
        },
        {
          id: 3,
          author: "GreenNeighbor",
          content: "This is exactly what our community needs. How can we get started?",
          timeAgo: "16 hours ago",
          likes: 6,
          liked: false
        }
      ]
    }
  ]);

  // Resources state
  const [resources, setResources] = useState([
    {
      id: 1,
      title: "Climate-Smart Agriculture Guide",
      type: "PDF Guide",
      category: "Farming",
      downloads: 1240,
      rating: 4.8,
      userRating: 0,
      description: "Comprehensive guide on adapting farming practices for climate resilience",
      tags: ["agriculture", "climate-adaptation", "sustainability"],
      fileSize: "2.4 MB"
    },
    {
      id: 2,
      title: "Government Renewable Energy Schemes 2024",
      type: "Policy Document",
      category: "Energy",
      downloads: 892,
      rating: 4.6,
      userRating: 0,
      description: "Latest updates on solar, wind, and biogas subsidies",
      tags: ["renewable-energy", "subsidies", "policy"],
      fileSize: "1.8 MB"
    },
    {
      id: 3,
      title: "Water Conservation Techniques",
      type: "Video Series",
      category: "Water",
      downloads: 567,
      rating: 4.9,
      userRating: 0,
      description: "Practical methods for rainwater harvesting and efficient irrigation",
      tags: ["water-conservation", "rainwater-harvesting", "irrigation"],
      fileSize: "45 MB"
    }
  ]);

  // Champions state
  const [climateChampions, setClimateChampions] = useState([
    {
      rank: 1,
      name: "Priya Sharma",
      location: "Kerala, India",
      points: 2450,
      level: "Climate Hero",
      achievements: ["Water Saver", "Solar Pioneer", "Community Leader"],
      contribution: "Installed solar panels, organized 15 community workshops",
      avatar: "green",
      monthlyGrowth: 150
    },
    {
      rank: 2,
      name: "Mohammed Ali",
      location: "Tamil Nadu, India",
      points: 2180,
      level: "Eco Champion",
      achievements: ["Organic Farmer", "Carbon Reducer", "Mentor"],
      contribution: "Converted 20 acres to organic farming, mentored 50+ farmers",
      avatar: "blue",
      monthlyGrowth: 120
    },
    {
      rank: 3,
      name: "Anjali Verma",
      location: "Maharashtra, India",
      points: 1950,
      level: "Green Guardian",
      achievements: ["Waste Warrior", "Tree Planter", "Innovator"],
      contribution: "Zero-waste community program, planted 500+ trees",
      avatar: "purple",
      monthlyGrowth: 200
    }
  ]);

  const categories = ['all', 'Farming', 'Energy', 'Water', 'Community', 'Policy'];

  // Filtered data based on search and category
  const getFilteredPosts = () => {
    let filtered = selectedCategory === 'all' ? forumPosts : forumPosts.filter(post => post.category === selectedCategory);
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return filtered;
  };

  const getFilteredResources = () => {
    let filtered = selectedCategory === 'all' ? resources : resources.filter(resource => resource.category === selectedCategory);
    if (searchQuery) {
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return filtered;
  };

  // Forum functions
  const handleLikePost = (postId) => {
    setForumPosts(posts => posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const post = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: "CurrentUser",
      category: newPost.category,
      replies: 0,
      views: 0,
      likes: 0,
      liked: false,
      timeAgo: "just now",
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      excerpt: newPost.content.substring(0, 50) + "...",
      replies_data: []
    };

    setForumPosts(posts => [post, ...posts]);
    setNewPost({ title: '', content: '', category: 'Farming', tags: '' });
    setShowNewPostModal(false);
  };

  // Resource functions
  const handleDownloadResource = (resourceId) => {
    setResources(resources => resources.map(resource => 
      resource.id === resourceId 
        ? { ...resource, downloads: resource.downloads + 1 }
        : resource
    ));
    alert('Download started! The resource will be saved to your downloads folder.');
  };

  const handleRateResource = (resourceId, rating) => {
    setResources(resources => resources.map(resource => 
      resource.id === resourceId 
        ? { ...resource, userRating: rating }
        : resource
    ));
  };

  const handleUploadResource = () => {
    if (!newResource.title.trim() || !newResource.description.trim()) return;

    const resource = {
      id: Date.now(),
      title: newResource.title,
      description: newResource.description,
      type: newResource.type,
      category: newResource.category,
      downloads: 0,
      rating: 5.0,
      userRating: 0,
      tags: ["user-uploaded"],
      fileSize: "Unknown"
    };

    setResources(resources => [resource, ...resources]);
    setNewResource({ title: '', description: '', category: 'Farming', type: 'PDF Guide', file: null });
    setShowUploadModal(false);
    alert('Resource uploaded successfully!');
  };

  // Champions functions
  const handleJoinChallenge = () => {
    alert('Welcome to the Climate Champions program! You will receive an email with getting started instructions.');
  };

  // Reply functions
  const handleShowReplies = (post) => {
    setSelectedPost(post);
    setShowRepliesModal(true);
  };

  const handleAddReply = () => {
    if (!newReply.trim() || !selectedPost) return;

    const reply = {
      id: Date.now(),
      author: "CurrentUser",
      content: newReply,
      timeAgo: "just now",
      likes: 0,
      liked: false
    };

    setForumPosts(posts => posts.map(post => 
      post.id === selectedPost.id 
        ? { 
            ...post, 
            replies: post.replies + 1,
            replies_data: [...post.replies_data, reply]
          }
        : post
    ));

    // Update selected post for modal
    setSelectedPost(prev => ({
      ...prev,
      replies: prev.replies + 1,
      replies_data: [...prev.replies_data, reply]
    }));

    setNewReply('');
  };

  const handleLikeReply = (replyId) => {
    const updatedPost = {
      ...selectedPost,
      replies_data: selectedPost.replies_data.map(reply =>
        reply.id === replyId
          ? { ...reply, likes: reply.liked ? reply.likes - 1 : reply.likes + 1, liked: !reply.liked }
          : reply
      )
    };

    setSelectedPost(updatedPost);
    
    setForumPosts(posts => posts.map(post => 
      post.id === selectedPost.id ? updatedPost : post
    ));
  };



  return (
    <div className="app-container">
    
      
      {/* Header */}
      <header className="header">
        <div className="header-content" style={{justifyContent: 'space-between'}}>
          <div className="header-title">
            <div className="header-icon">
              <Users size={24} />
            </div>
            <div className="header-text">
              <h1>Community & Knowledge Hub</h1>
              <p>Connect, Learn, and Lead the Climate Action Movement</p>
            </div>
          </div>
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search discussions, resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <div className="nav-tabs-content">
          {[
            { id: 'forum', label: 'Forum & Q&A', icon: MessageSquare },
            { id: 'resources', label: 'Resource Library', icon: BookOpen },
            { id: 'champions', label: 'Climate Champions', icon: Trophy }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Category Filter */}
        {(activeTab === 'forum' || activeTab === 'resources') && (
          <div className="filter-section">
            <div className="filter-header">
              <Filter size={20} />
              <span>Filter by Category:</span>
            </div>
            <div className="filter-buttons">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Forum Tab */}
        {activeTab === 'forum' && (
          <div>
            <div className="section-header">
              <h2 className="section-title">Community Discussions</h2>
              <button 
                onClick={() => setShowNewPostModal(true)}
                className="btn btn-primary"
              >
                <Plus size={16} />
                Start New Discussion
              </button>
            </div>

            <div className="posts-grid">
              {getFilteredPosts().map(post => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="post-content">
                      <h3 className="post-title">{post.title}</h3>
                      <p className="post-text">{post.content}</p>
                      <div className="tag-list">
                        {post.tags.map(tag => (
                          <span key={tag} className="tag">#{tag}</span>
                        ))}
                      </div>
                    </div>
                    <span className={`category-badge category-${post.category.toLowerCase()}`}>
                      {post.category}
                    </span>
                  </div>
                  
                  <div className="post-footer">
                    <div className="post-author">
                      <span className="author-name">@{post.author}</span>
                      <span>{post.timeAgo}</span>
                    </div>
                    <div className="post-stats">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className={`stat-item ${post.liked ? 'liked' : ''}`}
                      >
                        <Heart size={16} />
                        <span>{post.likes}</span>
                      </button>
                      <button 
                        onClick={() => handleShowReplies(post)}
                        className="stat-item"
                      >
                        <MessageCircle size={16} />
                        <span>{post.replies}</span>
                      </button>
                      <div className="stat-item">
                        <Eye size={16} />
                        <span>{post.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {getFilteredPosts().length === 0 && (
              <div className="empty-state">
                <MessageSquare className="empty-icon" size={48} />
                <p className="empty-text">No discussions found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div>
            <div className="section-header">
              <h2 className="section-title">Resource Library</h2>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="btn btn-secondary"
              >
                <Upload size={16} />
                Upload Resource
              </button>
            </div>

            <div className="resources-grid">
              {getFilteredResources().map(resource => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-header">
                    <div>
                      <h3 className="resource-title">{resource.title}</h3>
                      <span className={`category-badge category-${resource.category.toLowerCase()}`}>
                        {resource.category}
                      </span>
                    </div>
                    <BookOpen size={24} />
                  </div>

                  <p className="resource-description">{resource.description}</p>

                  <div className="tag-list">
                    {resource.tags.map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>

                  <div className="resource-info">
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => handleRateResource(resource.id, star)}
                          className="star"
                        >
                          <Star className={star <= (resource.userRating || resource.rating) ? 'star filled' : 'star'} size={16} />
                        </button>
                      ))}
                      <span style={{marginLeft: '0.25rem', fontSize: '0.875rem', fontWeight: '500'}}>{resource.rating}</span>
                    </div>
                    <div style={{fontSize: '0.75rem'}}>{resource.fileSize}</div>
                  </div>

                  <div className="resource-info">
                    <div className="download-stats">
                      <Download size={16} />
                      <span>{resource.downloads} downloads</span>
                    </div>
                    <span>{resource.type}</span>
                  </div>

                  <button 
                    onClick={() => handleDownloadResource(resource.id)}
                    className="btn btn-primary"
                    style={{width: '100%', justifyContent: 'center'}}
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              ))}
            </div>

            {getFilteredResources().length === 0 && (
              <div className="empty-state">
                <BookOpen className="empty-icon" size={48} />
                <p className="empty-text">No resources found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Climate Champions Tab */}
        {activeTab === 'champions' && (
          <div>
            <div style={{textAlign: 'center', marginBottom: '2rem'}}>
              <h2 style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem'}}>
                Climate Champions Leaderboard
              </h2>
              <p style={{color: '#6b7280'}}>Celebrating our community's sustainability heroes</p>
            </div>

            {/* Stats Overview */}
            <div className="stats-overview">
              <div className="stat-card green">
                <div className="stat-content">
                  <div>
                    <p className="stat-label">Total Champions</p>
                    <p className="stat-number">{climateChampions.length + 1244}</p>
                  </div>
                  <Award size={32} />
                </div>
              </div>
              <div className="stat-card blue">
                <div className="stat-content">
                  <div>
                    <p className="stat-label">Impact Points</p>
                    <p className="stat-number">
                      {Math.round(climateChampions.reduce((sum, champion) => sum + champion.points, 0) / 1000 * 2.4)}M
                    </p>
                  </div>
                  <Target size={32} />
                </div>
              </div>
              <div className="stat-card purple">
                <div className="stat-content">
                  <div>
                    <p className="stat-label">Active This Month</p>
                    <p className="stat-number">
                      {climateChampions.filter(c => c.monthlyGrowth > 0).length + 453}
                    </p>
                  </div>
                  <TrendingUp size={32} />
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="leaderboard">
              <div className="leaderboard-header">
                <h3 className="leaderboard-title">Top Climate Champions</h3>
              </div>
              <div>
                {climateChampions.map(champion => (
                  <div key={champion.rank} className="champion-item">
                    <div className="champion-content">
                      {/* Rank */}
                      <div className={`rank-badge rank-${champion.rank <= 3 ? champion.rank : 'default'}`}>
                        {champion.rank}
                      </div>

                      {/* Avatar */}
                      <div className={`avatar ${champion.avatar}`}>
                        {champion.name.split(' ').map(n => n[0]).join('')}
                      </div>

                      {/* Info */}
                      <div className="champion-info">
                        <div className="champion-name">
                          <h4 className="champion-title">{champion.name}</h4>
                          <span className={`level-badge level-${champion.level.split(' ')[1] ? champion.level.split(' ')[1].toLowerCase() : 'hero'}`}>
                            {champion.level}
                          </span>
                          {champion.monthlyGrowth > 0 && (
                            <span className="growth-indicator">
                              <TrendingUp size={12} />
                              +{champion.monthlyGrowth} this month
                            </span>
                          )}
                        </div>
                        <p className="champion-location">{champion.location}</p>
                        <p className="champion-contribution">{champion.contribution}</p>
                        <div className="achievements">
                          {champion.achievements.map(achievement => (
                            <span key={achievement} className="achievement">
                              <Leaf size={12} />
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Points */}
                      <div className="points-section">
                        <div className="points-number">{champion.points.toLocaleString()}</div>
                        <div className="points-label">impact points</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Join Challenge CTA */}
            <div className="cta-section">
              <h3 className="cta-title">Ready to Become a Climate Champion?</h3>
              <p className="cta-description">Join our community challenges and start making a difference today!</p>
              <button 
                onClick={handleJoinChallenge}
                className="cta-button"
              >
                Join the Movement
              </button>
            </div>
          </div>
        )}
      </main>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Start New Discussion</h3>
              <button onClick={() => setShowNewPostModal(false)} className="close-button">
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="form-input"
                  placeholder="What would you like to discuss?"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  className="form-select"
                >
                  {categories.filter(c => c !== 'all').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="form-textarea"
                  placeholder="Describe your question or topic in detail..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                  className="form-input"
                  placeholder="climate, farming, solar, etc."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowNewPostModal(false)} className="btn-ghost">
                Cancel
              </button>
              <button onClick={handleCreatePost} className="btn btn-primary">
                <Send size={16} />
                Post Discussion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replies Modal */}
      {showRepliesModal && selectedPost && (
        <div className="modal-overlay">
          <div className="modal" style={{maxWidth: '50rem'}}>
            <div className="modal-header">
              <h3 className="modal-title">Discussion Replies</h3>
              <button onClick={() => setShowRepliesModal(false)} className="close-button">
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              {/* Original Post */}
              <div className="original-post">
                <div className="post-header">
                  <div className="post-content">
                    <h3 className="post-title">{selectedPost.title}</h3>
                    <p className="post-text">{selectedPost.content}</p>
                    <div className="tag-list">
                      {selectedPost.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                  <span className={`category-badge category-${selectedPost.category.toLowerCase()}`}>
                    {selectedPost.category}
                  </span>
                </div>
                <div className="post-footer">
                  <div className="post-author">
                    <span className="author-name">@{selectedPost.author}</span>
                    <span>{selectedPost.timeAgo}</span>
                  </div>
                  <div className="post-stats">
                    <div className="stat-item">
                      <Heart size={16} />
                      <span>{selectedPost.likes}</span>
                    </div>
                    <div className="stat-item">
                      <MessageCircle size={16} />
                      <span>{selectedPost.replies}</span>
                    </div>
                    <div className="stat-item">
                      <Eye size={16} />
                      <span>{selectedPost.views}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Replies Section */}
              <div className="replies-section">
                <h4 className="replies-title">
                  {selectedPost.replies_data.length} {selectedPost.replies_data.length === 1 ? 'Reply' : 'Replies'}
                </h4>
                
                {selectedPost.replies_data.map(reply => (
                  <div key={reply.id} className="reply-item">
                    <div className="reply-content">
                      <div className="reply-header">
                        <span className="reply-author">@{reply.author}</span>
                        <span className="reply-time">{reply.timeAgo}</span>
                      </div>
                      <p className="reply-text">{reply.content}</p>
                      <div className="reply-actions">
                        <button 
                          onClick={() => handleLikeReply(reply.id)}
                          className={`reply-like ${reply.liked ? 'liked' : ''}`}
                        >
                          <Heart size={14} />
                          <span>{reply.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {selectedPost.replies_data.length === 0 && (
                  <div className="no-replies">
                    <p>No replies yet. Be the first to respond!</p>
                  </div>
                )}

                {/* Add Reply Form */}
                <div className="add-reply-form">
                  <div className="form-group">
                    <label className="form-label">Add your reply</label>
                    <textarea
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      className="form-textarea"
                      placeholder="Share your thoughts, experiences, or advice..."
                      rows={4}
                    />
                  </div>
                  <button 
                    onClick={handleAddReply}
                    className="btn btn-primary"
                    disabled={!newReply.trim()}
                  >
                    <Send size={16} />
                    Post Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Resource Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Upload New Resource</h3>
              <button onClick={() => setShowUploadModal(false)} className="close-button">
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Resource Title</label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  className="form-input"
                  placeholder="Enter resource title"
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={newResource.category}
                    onChange={(e) => setNewResource({...newResource, category: e.target.value})}
                    className="form-select"
                  >
                    {categories.filter(c => c !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Resource Type</label>
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                    className="form-select"
                  >
                    <option value="PDF Guide">PDF Guide</option>
                    <option value="Video Series">Video Series</option>
                    <option value="Policy Document">Policy Document</option>
                    <option value="Research Paper">Research Paper</option>
                    <option value="Infographic">Infographic</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={newResource.description}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  className="form-textarea"
                  placeholder="Describe the resource content and its benefits..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Upload File</label>
                <div className="upload-zone">
                  <Upload className="upload-icon" size={32} />
                  <p className="upload-text">Click to upload or drag and drop</p>
                  <p className="upload-subtext">PDF, DOC, MP4, or ZIP files up to 10MB</p>
                  <input
                    type="file"
                    onChange={(e) => setNewResource({...newResource, file: e.target.files[0]})}
                    style={{display: 'none'}}
                    accept=".pdf,.doc,.docx,.mp4,.zip"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowUploadModal(false)} className="btn-ghost">
                Cancel
              </button>
              <button onClick={handleUploadResource} className="btn btn-secondary">
                <Upload size={16} />
                Upload Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityKnowledgeHub;
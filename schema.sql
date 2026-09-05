
-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    location VARCHAR(255),
    platform VARCHAR(50) NOT NULL,
    channel_name VARCHAR(100),
    tags JSON,
    notes JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(50) PRIMARY KEY,
    contact_id VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255),
    customer_avatar VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    platform VARCHAR(50) NOT NULL,
    channel_name VARCHAR(100),
    last_message TEXT,
    last_message_timestamp VARCHAR(50),
    unread_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    tags JSON,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_online BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(50) PRIMARY KEY,
    conversation_id VARCHAR(50) NOT NULL,
    sender VARCHAR(50) NOT NULL, -- 'agent' or 'customer'
    sender_name VARCHAR(255),
    text TEXT,
    timestamp VARCHAR(50),
    status VARCHAR(50), -- 'sent', 'delivered', 'read'
    attachment_type VARCHAR(50), -- 'image', 'file', null
    attachment_url VARCHAR(255),
    attachment_name VARCHAR(255),
    attachment_size VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Integrations table
CREATE TABLE IF NOT EXISTS integrations (
    id VARCHAR(50) PRIMARY KEY,
    platform VARCHAR(50) NOT NULL, -- 'facebook', 'whatsapp'
    account_name VARCHAR(255),
    identifier VARCHAR(255),
    is_connected BOOLEAN DEFAULT FALSE,
    webhook_status VARCHAR(50) DEFAULT 'offline',
    messages_today INT DEFAULT 0,
    last_sync VARCHAR(50),
    access_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==================================================================
-- Seed data (optional — safe to re-run; INSERT IGNORE avoids duplicates)
-- ==================================================================

INSERT IGNORE INTO integrations (id, platform, account_name, identifier, is_connected, webhook_status, messages_today, last_sync) VALUES
('int_facebook_main', 'facebook', 'Social Ads Studio', '110203040506070', 1, 'operational', 12, 'Just now'),
('int_whatsapp_main', 'whatsapp', 'Social Ads Studio', '+8801712345678', 1, 'operational', 7, 'Just now');

INSERT IGNORE INTO contacts (id, name, avatar, phone, email, location, platform, channel_name, tags, notes) VALUES
('cnt_1001', 'Tanvir Hasan', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', '+880 1711-223344', 'tanvir.hasan@gmail.com', 'Mirpur, Dhaka', 'facebook', 'Facebook Messenger', '["VIP"]', '[{"id":"n1","text":"Buys twice a month","author":"Agent","createdAt":"Today"}]'),
('cnt_1002', 'Nusrat Jahan', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', '+880 1812-556677', 'nusrat.jahan@yahoo.com', 'Gulshan-2, Dhaka', 'whatsapp', 'WhatsApp Business', '["Lead"]', '[]'),
('cnt_1003', 'Rafiq Ahmed', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', '+880 1913-889900', 'rafiq.ahmed@outlook.com', 'Chittagong', 'facebook', 'Facebook Messenger', '["Returning Customer"]', '[]');

INSERT IGNORE INTO conversations (id, contact_id, customer_name, customer_avatar, customer_phone, customer_email, platform, channel_name, last_message, last_message_timestamp, unread_count, status, tags, is_pinned, is_online) VALUES
('conv_2001', 'cnt_1001', 'Tanvir Hasan', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', '+880 1711-223344', 'tanvir.hasan@gmail.com', 'facebook', 'Facebook Messenger', 'Is the XL hoodie in stock?', '9:41 AM', 2, 'active', '["VIP"]', 1, 1),
('conv_2002', 'cnt_1002', 'Nusrat Jahan', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', '+880 1812-556677', 'nusrat.jahan@yahoo.com', 'whatsapp', 'WhatsApp Business', 'What is your delivery time?', '9:02 AM', 1, 'active', '["Lead"]', 0, 1),
('conv_2003', 'cnt_1003', 'Rafiq Ahmed', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', '+880 1913-889900', 'rafiq.ahmed@outlook.com', 'facebook', 'Facebook Messenger', 'Thanks, received the parcel!', 'Yesterday', 0, 'active', '["Returning Customer"]', 0, 0);

INSERT IGNORE INTO messages (id, conversation_id, sender, sender_name, text, timestamp, status) VALUES
('msg_3001', 'conv_2001', 'customer', 'Tanvir Hasan', 'Salam, is the XL hoodie in stock?', '9:38 AM', 'read'),
('msg_3002', 'conv_2001', 'agent', 'System Agent', 'Walaikum Assalam! Yes, we have XL in black and navy.', '9:40 AM', 'delivered'),
('msg_3003', 'conv_2001', 'customer', 'Tanvir Hasan', 'Great, send me the price please.', '9:41 AM', 'delivered'),
('msg_3004', 'conv_2002', 'customer', 'Nusrat Jahan', 'What is your delivery time to Gulshan?', '9:02 AM', 'delivered'),
('msg_3005', 'conv_2003', 'customer', 'Rafiq Ahmed', 'Thanks, received the parcel!', 'Yesterday', 'read');

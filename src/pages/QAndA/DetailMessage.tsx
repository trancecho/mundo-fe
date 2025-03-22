import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header/Header';
import styles from './DetailMessage.module.css';
import { getMessageDetail, createReply, getMessageReplies } from '@/router/api';

interface DetailMessageProps {}

interface MessageDetail {
  id: number;
  title: string;
  content: string;
  tags: string[];
  views: number;
  replies: number;
  created_at: string;
  is_official: boolean;
  pictures: string[];
  author: {
    id: number;
    username: string;
    avatar: string;
  };
}

interface Reply {
  id: number;
  content: string;
  created_at: string;
  pictures: string[];
  author: {
    id: number;
    username: string;
    avatar: string;
  };
  likes: number;
  is_liked: boolean;
}

const DetailMessage: React.FC<DetailMessageProps> = () => {
  // ... component implementation ...
};

// Add the default export
export default DetailMessage;
import React, { useEffect, useState, useRef } from "react";
import Style from "./DetailMessage.module.css";
import { useParams } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';
import { Dispatch, SetStateAction } from "react";
import Header from '@/components/ui/Header/Header.tsx';

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

export default DetailMessage;
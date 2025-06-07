import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Icon,
  Text,
  Flex,
  Progress,
  Alert,
  AlertIcon,
  CloseButton,
  useToast
} from '@chakra-ui/react';
import { FaUpload, FaFile } from 'react-icons/fa';
import api from '../services/api';

interface FileUploadProps {
  onUploadSuccess?: (fileData: any) => void;
  onUploadError?: (error: string) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number; // 以MB为单位
  label?: string;
  endpoint?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  acceptedFileTypes = 'image/*,.pdf,.doc,.docx',
  maxFileSize = 10, // 默认10MB
  label = '上传文件',
  endpoint = '/api/upload'
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // 检查文件大小
      if (file.size > maxFileSize * 1024 * 1024) {
        setError(`文件大小不能超过 ${maxFileSize}MB`);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('请选择要上传的文件');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      });

      setUploading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast({
        title: '上传成功',
        description: '文件已成功上传',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      if (onUploadSuccess) {
        onUploadSuccess(response.data.file);
      }
    } catch (err: any) {
      setUploading(false);
      const errorMessage = 
        err.response?.data?.message || 
        '上传失败，请稍后再试';
      
      setError(errorMessage);
      
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    }
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>{label}</FormLabel>
        
        <input
          type="file"
          accept={acceptedFileTypes}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        
        <Flex direction="column">
          <Button
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Icon as={FaUpload} />}
            colorScheme="blue"
            isDisabled={uploading}
            variant="outline"
            mb={4}
          >
            选择文件
          </Button>
          
          {selectedFile && (
            <Flex 
              alignItems="center" 
              p={2} 
              border="1px" 
              borderColor="gray.200" 
              borderRadius="md"
              mb={4}
            >
              <Icon as={FaFile} color="blue.500" mr={2} />
              <Text fontSize="sm" isTruncated>
                {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </Text>
            </Flex>
          )}
          
          {selectedFile && (
            <Button
              colorScheme="blue"
              onClick={handleUpload}
              isLoading={uploading}
              loadingText="上传中..."
              mb={4}
            >
              上传
            </Button>
          )}
          
          {uploading && (
            <Progress 
              value={uploadProgress} 
              size="sm" 
              colorScheme="blue" 
              mb={4} 
              borderRadius="md"
            />
          )}
          
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
              <CloseButton
                position="absolute"
                right="8px"
                top="8px"
                onClick={() => setError(null)}
              />
            </Alert>
          )}
        </Flex>
      </FormControl>
    </Box>
  );
};

export default FileUpload; 
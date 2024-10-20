
variable "do_token" {
  description = "DigitalOcean API Token"
}

variable "github_repo" {
  description = "GitHub repository URL"
}

variable "database_url" {
  description = "SingleStore database URL"
}

variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "aws_access_key" {
  description = "AWS access key"
}

variable "aws_secret_key" {
  description = "AWS secret key"
}

variable "s3_bucket_name" {
  description = "S3 bucket name for interview recordings"
}
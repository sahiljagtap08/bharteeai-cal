output "app_url" {
  value       = digitalocean_app.bharteeai.default_ingress
  description = "The URL of the deployed DigitalOcean App"
}

output "s3_bucket_name" {
  value       = aws_s3_bucket.interview_recordings.id
  description = "The name of the S3 bucket for interview recordings"
}

output "iam_user_access_key" {
  value       = aws_iam_access_key.bharteeai_user_key.id
  description = "The access key for the IAM user"
  sensitive   = true
}

output "iam_user_secret_key" {
  value       = aws_iam_access_key.bharteeai_user_key.secret
  description = "The secret key for the IAM user"
  sensitive   = true
}

terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

resource "digitalocean_app" "bharteeai" {
  spec {
    name   = "bharteeai"
    region = "nyc"

    service {
      name               = "bharteeai-backend"
      environment_slug   = "node-js"
      instance_count     = 1
      instance_size_slug = "basic-xxs"

      git {
        repo_clone_url = var.github_repo
        branch         = "main"
      }

      env {
        key   = "DATABASE_URL"
        value = var.database_url
      }
    }

    static_site {
      name          = "bharteeai-frontend"
      build_command = "npm run build"
      output_dir    = "/dist"

      git {
        repo_clone_url = var.github_repo
        branch         = "main"
      }
    }
  }
}

resource "aws_s3_bucket" "interview_recordings" {
  bucket = var.s3_bucket_name
  acl    = "private"

  versioning {
    enabled = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_iam_user" "bharteeai_user" {
  name = "bharteeai-app-user"
}

resource "aws_iam_access_key" "bharteeai_user_key" {
  user = aws_iam_user.bharteeai_user.name
}

resource "aws_iam_user_policy" "bharteeai_user_policy" {
  name = "bharteeai-app-policy"
  user = aws_iam_user.bharteeai_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket",
        ]
        Effect = "Allow"
        Resource = [
          aws_s3_bucket.interview_recordings.arn,
          "${aws_s3_bucket.interview_recordings.arn}/*",
        ]
      },
    ]
  })
}

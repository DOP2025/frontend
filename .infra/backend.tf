terraform {
  backend "s3" {
    bucket = "dop10-tfd-s3-an2-lenv-01"
    key = "dop10/dev-tfstate"
    region = "ap-northeast-2"
    encrypt = true
    dynamodb_table = "dop10-tfd-dynamodb-an2-lenv-01" # WARN: state locking with DynamoDB still SUS have to resolves this issue after.
  }

  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}


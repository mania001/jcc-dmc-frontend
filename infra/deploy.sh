#!/bin/bash
set -e

# .env 파일 로드 (.env → .env.production 순서로 덮어씀)
for file in .env .env.production; do
  if [ -f "$file" ]; then
    export $(grep -v '^#' "$file" | xargs)
  fi
done

aws cloudformation deploy \
  --template-file infra/cloudformation.yml \
  --stack-name jcc-dmc-frontend \
  --profile serverless-deployer \
  --region ap-northeast-2 \
  --no-fail-on-empty-changeset \
  --parameter-overrides \
      DomainName="${DOMAIN_NAME:-}" \
      AcmCertificateArn="${ACM_CERTIFICATE_ARN:-}"

echo ""
echo "✅ 완료"
aws cloudformation describe-stacks \
  --stack-name jcc-dmc-frontend \
  --profile serverless-deployer \
  --region ap-northeast-2 \
  --query 'Stacks[0].Outputs' \
  --output table

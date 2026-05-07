#!/bin/bash
set -e

STAGE=${1:-prod}
STACK_NAME="jcc-dmc-frontend-${STAGE}"
BUCKET_NAME="jcc-dmc-frontend-${STAGE}"

# env 파일 로드 (.env → stage별 파일 순서로 덮어씀)
if [ "$STAGE" = "prod" ]; then
  ENV_FILES=".env .env.production"
else
  ENV_FILES=".env .env.${STAGE}"
fi

for file in $ENV_FILES; do
  if [ -f "$file" ]; then
    set -a; source "$file"; set +a
  fi
done

echo "🚀 [$STAGE] 배포 시작"

# 1. CloudFormation 인프라 배포
echo "  인프라 배포 중..."
aws cloudformation deploy \
  --template-file infra/cloudformation.yml \
  --stack-name "$STACK_NAME" \
  --profile serverless-deployer \
  --region ap-northeast-2 \
  --no-fail-on-empty-changeset \
  --parameter-overrides \
      Stage="$STAGE" \
      DomainName="${DOMAIN_NAME:-}" \
      AcmCertificateArn="${ACM_CERTIFICATE_ARN:-}"

# 2. CloudFront Distribution ID 조회
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --profile serverless-deployer \
  --region ap-northeast-2 \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text)

# 3. 앱 빌드
echo "  앱 빌드 중..."
if [ "$STAGE" = "prod" ]; then
  npx tsc -b && npx vite build
else
  npx tsc -b && npx vite build --mode "$STAGE"
fi

# 4. S3 업로드
echo "  S3 업로드 중..."
aws s3 sync ./dist "s3://$BUCKET_NAME" \
  --profile serverless-deployer \
  --delete \
  --cache-control max-age=31536000 \
  --exclude index.html

aws s3 cp ./dist/index.html "s3://$BUCKET_NAME/index.html" \
  --profile serverless-deployer \
  --cache-control no-cache,no-store,must-revalidate

# 5. CloudFront 캐시 무효화
echo "  캐시 무효화 중..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths '/*' \
  --profile serverless-deployer

echo ""
echo "✅ [$STAGE] 배포 완료"
aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --profile serverless-deployer \
  --region ap-northeast-2 \
  --query 'Stacks[0].Outputs' \
  --output table

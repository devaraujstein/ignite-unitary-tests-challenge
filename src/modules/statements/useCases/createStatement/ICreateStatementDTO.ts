import { OperationType } from "../../entities/Statement";

export type ICreateStatementDTO =
{
  user_id: string;
  sender_id ?: string;
  description: string;
  amount: number;
  type: OperationType;
}

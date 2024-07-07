export interface DocumentsType {
  id?: number
  enrollment_id: number
  created_at?: Date
  update_at?: Date
}

export interface DocumentsRepository {
  create(data: DocumentsType): Promise<DocumentsType>
  findById(fileId: number): Promise<DocumentsType | null>
  destroy(fileId: number): Promise<Boolean>

}

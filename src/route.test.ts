import { GET } from './app/api/favorite/route'; // ★ 1. テスト対象の関数をGETとしてインポート
import { db } from './lib/prisma';         // ★ 2. dbインスタンスをインポート (モック対象)
import { NextResponse } from "next/server";     // ★ 3. NextResponseもインポート


jest.mock('./lib/prisma', () => ({
  db: {
    user_log: {
      groupBy: jest.fn(),
    },
    place: {
      findMany: jest.fn(),
    },
  },
}));

// ★ 4. NextResponse.json() の結果の型をTypeScriptで定義 (テストの可読性のため)
interface ApiResponse {
  status_code: number;
  place?: { id: number; name: string; view: number }[];
  message?: string;
}

// jest.Mocked<any> は、型定義の補完を簡単にするために使用します
const mockDb = db as jest.Mocked<typeof db>;

// GET 関数が Request オブジェクトを引数に取るため、モックを作成します
const mockRequest = {} as Request;


describe('GET /api/favorite (Popular Places API)', () => {

  // 各テストの前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 with an empty array when no logs are found within the week', async () => {
    // user_log.groupBy が空の結果を返すようにモック
    (mockDb.user_log.groupBy as jest.Mock).mockResolvedValue([]);
    
    // GET関数を呼び出す
    const response = await GET(mockRequest);
    const data: ApiResponse = await response.json(); // Next.jsのAPIルートはResponseオブジェクトを返すため、.json() でデータを取得

    // 期待されるレスポンスの検証
    expect(response.status).toBe(200);
    expect(data).toEqual({ status_code: 200, place: [] });
  });

  it('should return 200 with sorted places based on view counts', async () => {
    // 1. groupBy のモック: 閲覧数が多い順に結果を定義
    const mockGroupedLogs = [
      { place_id: 1, _count: { _all: 10 } }, // 10 views
      { place_id: 2, _count: { _all: 5 } },  // 5 views
      { place_id: 3, _count: { _all: 3 } },  // 3 views
    ];
    (mockDb.user_log.groupBy as jest.Mock).mockResolvedValue(mockGroupedLogs);

    // 2. findMany のモック: 場所の名前情報
    const mockPlaces = [
      { id: 1, name: '名古屋城' },
      { id: 2, name: '東山動植物園' }, // サンプルデータに合わせて名前を変更
      { id: 3, name: 'オアシス21' },
    ];
    // findManyはIDのin句で呼ばれるため、順序は保証されない
    (mockDb.place.findMany as jest.Mock).mockResolvedValue(mockPlaces);

    // GET関数を呼び出す
    const response = await GET(mockRequest);
    const data: ApiResponse = await response.json();

    // 期待されるレスポンスの検証
    expect(response.status).toBe(200);
    expect(data.status_code).toBe(200);
    
    // 最終的な結果は groupBy の順序（viewの降順）になっていることを確認
    expect(data.place).toEqual([
      { id: 1, name: '名古屋城', view: 10 },
      { id: 2, name: '東山動植物園', view: 5 },
      { id: 3, name: 'オアシス21', view: 3 },
    ]);
  });

  it('should handle missing place names and return only existing ones', async () => {
    // ログにはID 999 があるが、placeテーブルにはID 999がないと仮定
    const mockGroupedLogs = [
      { place_id: 1, _count: { _all: 10 } },
      { place_id: 999, _count: { _all: 5 } }, // ID 999 は場所情報がない
    ];
    (mockDb.user_log.groupBy as jest.Mock).mockResolvedValue(mockGroupedLogs);

    // place.findMany のモック: ID 1 の情報のみを返す
    const mockPlaces = [
      { id: 1, name: '存在する場所' },
    ];
    (mockDb.place.findMany as jest.Mock).mockResolvedValue(mockPlaces);

    const response = await GET(mockRequest);
    const data: ApiResponse = await response.json();

    expect(data.place?.length).toBe(1); // 1件のみ返されるべき
    expect(data.place).toEqual([
      { id: 1, name: '存在する場所', view: 10 },
    ]);
  });

  it('should return 500 status on database error', async () => {
    // groupByでエラーが発生するようにモック
    (mockDb.user_log.groupBy as jest.Mock).mockRejectedValue(new Error('DB Connection Failed'));

    const response = await GET(mockRequest);
    const data: ApiResponse = await response.json();

    // 500エラーレスポンスの検証
    expect(response.status).toBe(500);
    expect(data).toEqual({ status_code: 500, message: "サーバーエラー" });
  });
});
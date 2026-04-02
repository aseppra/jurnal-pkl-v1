<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dudis', function (Blueprint $table) {
            $table->time('jam_masuk')->default('08:00')->after('contact');
            $table->time('jam_pulang')->default('16:00')->after('jam_masuk');
        });
    }

    public function down(): void
    {
        Schema::table('dudis', function (Blueprint $table) {
            $table->dropColumn(['jam_masuk', 'jam_pulang']);
        });
    }
};
